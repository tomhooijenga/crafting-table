import { defineStore } from "pinia";
import { Recipe, Tile } from "./types";
import { AIR, equals, getItem, tileStackLeft } from "@/lib/items";
import { reactive, ref } from "vue";

export const EMPTY = { item: AIR, amount: 0 };

// Todo: point + <num> key places from hotbar
// Todo: Press Q, throw 1
// Todo: Press Shift+Q, throw stack
export const useStore = defineStore("selection", () => {
  const selection = ref(EMPTY);
  const regions = reactive<Tile[][]>([]);

  const tiles: Tile[] = [];
  const grid = createRegion(9);
  const inventory = createRegion(27);
  const hotbar = createRegion(9);

  const mouse = reactive({
    x: 0,
    y: 0,
  });

  function transfer(from: Tile, to: Tile, transferAmount = from.value.amount) {
    const { item: fromItem, amount: fromAmount } = from.value;
    const { item: toItem, amount: toAmount } = to.value;

    const newFromAmount = fromAmount - transferAmount;
    const newToAmount = toAmount + transferAmount;

    // Can't take this much.
    if (!equals(toItem, AIR) && toItem.stackSize < newToAmount) {
      return;
    }

    from.value =
      newFromAmount <= 0
        ? EMPTY
        : {
            item: fromItem,
            amount: newFromAmount,
          };

    to.value = {
      item: fromItem,
      amount: newToAmount,
    };
  }

  function transferAll(from: Tile, to: Tile[]): number {
    const { item } = from.value;
    const targets = to
      .filter(
        (tile) => equals(tile.value.item, AIR) || equals(tile.value.item, item)
      )
      .sort((a, b) => {
        if (equals(a.value.item, b.value.item)) {
          return 0;
        }

        return equals(a.value.item, AIR) ? 1 : -1;
      });

    const startAmount = from.value.amount;
    let transferAmount = startAmount;

    for (const target of targets) {
      const amount = Math.min(transferAmount, tileStackLeft(target, item));
      transfer(from, target, amount);

      transferAmount -= amount;
      if (transferAmount === 0) {
        break;
      }
    }

    return startAmount - transferAmount;
  }

  function createRegion(amount: number): Tile[] {
    const region = Array.from({ length: amount }).map(() => ref(EMPTY));
    tiles.push(...region);
    regions.push(region);
    return region;
  }

  function tileToSelection(tile: Tile, takeAmount = tile.value.amount): void {
    transfer(tile, selection, takeAmount);
  }

  function selectionToTile(
    tile: Tile,
    placeAmount = selection.value.amount
  ): void {
    transfer(selection, tile, placeAmount);
  }

  function drop(): void {
    selection.value = EMPTY;
  }

  function swap(tile: Tile): void {
    [tile.value, selection.value] = [selection.value, tile.value];
  }

  function click(tile: Tile): void {
    const { item } = tile.value;

    // Selection is air, take tile
    if (equals(selection.value.item, AIR)) {
      tileToSelection(tile);
    }
    // Selection is same as tile, place on tile
    else if (equals(selection.value.item, item)) {
      selectionToTile(tile);
    }
    // Tile is air, place selection on tile
    else if (equals(item, AIR)) {
      selectionToTile(tile);
    }
    // Items are not same, swap
    else {
      swap(tile);
    }
  }

  function rightClick(tile: Tile): void {
    const { item, amount } = tile.value;

    // Selection is air, take half of tile
    if (equals(selection.value.item, AIR)) {
      tileToSelection(tile, Math.ceil(amount / 2));
    }
    // Selection is same as tile, place 1 on tile
    else if (equals(selection.value.item, item)) {
      selectionToTile(tile, 1);
    }
    // Tile is air, place 1 on tile
    else if (equals(item, AIR)) {
      selectionToTile(tile, 1);
    }
    // Items are not same, swap
    else {
      swap(tile);
    }
  }

  function dblClick(tile: Tile): void {
    const stackedNeighbours = [];
    const { item } = tile.value;
    let stackLeft = tileStackLeft(tile);

    for (const neighbour of tiles) {
      const { item: neighbourItem, amount: neighbourAmount } = neighbour.value;

      if (stackLeft === 0) {
        break;
      }
      if (neighbour === tile) {
        continue;
      }
      if (!equals(neighbourItem, item)) {
        continue;
      }
      // Try to avoid neighbours that are a full stack.
      if (neighbourAmount === item.stackSize) {
        stackedNeighbours.push(neighbour);
        continue;
      }

      const take = Math.min(neighbourAmount, stackLeft);
      stackLeft -= take;

      transfer(neighbour, tile, take);
    }

    for (const neighbour of stackedNeighbours) {
      const { amount: neighbourAmount } = neighbour.value;

      if (stackLeft === 0) {
        break;
      }

      const take = Math.min(neighbourAmount, stackLeft);
      stackLeft -= take;

      transfer(neighbour, tile, take);
    }

    tileToSelection(tile);
  }

  function shiftClick(tile: Tile): void {
    for (const region of regions) {
      // Skip own region.
      if (region.includes(tile)) {
        continue;
      }

      const available =
        // Find first of own item, or air.
        region.find((neighbour) => {
          return (
            equals(neighbour.value.item, tile.value.item) && neighbour !== tile
          );
        }) || region.find((neighbour) => equals(neighbour.value.item, AIR));

      if (available) {
        transfer(tile, available);
        break;
      }
    }
  }

  let isMousedown = false;
  let startAmount = 0;
  const filled = new Map<Tile, number>();

  function mousedown(tile: Tile): void {
    isMousedown = true;
    startAmount = selection.value.amount;
  }

  function mouseup(tile: Tile): void {
    isMousedown = false;
    filled.clear();

    if (selection.value.amount <= 0) {
      drop();
    }
  }

  function mouseleave(tile: Tile): void {
    // Only the first tile gets filled on mouse leave.
    if (filled.size === 0) {
      mouseenter(tile);
    }
  }

  function mouseenter(tile: Tile): void {
    const { item } = tile.value;
    const { item: selectionItem } = selection.value;

    const validTarget = equals(item, AIR) || equals(item, selectionItem);

    if (isMousedown && validTarget && selectionItem && !filled.has(tile)) {
      filled.set(tile, tile.value.amount);

      const perTileAmount = Math.floor(startAmount / filled.size);
      let amountLeft = startAmount;
      for (const [neighbour, originalAmount] of filled) {
        const actualTileAmount = Math.min(
          originalAmount + perTileAmount,
          selectionItem.stackSize
        );
        amountLeft -= actualTileAmount;

        neighbour.value = {
          item: selectionItem,
          amount: actualTileAmount,
        };
      }

      selection.value = {
        item: selectionItem,
        amount: amountLeft,
      };

      // Placed last of stack, drop
      if (perTileAmount === 1 && filled.size === startAmount) {
        drop();
      }
    }
  }

  function craft(recipe: Recipe) {
    const item = getItem(recipe.result.id);

    if (
      !equals(selection.value.item, AIR) &&
      !equals(selection.value.item, item)
    ) {
      return;
    }

    const crafted = ref({
      item,
      amount: recipe.result.count,
    });

    transfer(crafted, selection);

    const trash: Tile = ref(EMPTY);
    grid.forEach((tile) => {
      transfer(tile, trash, 1);
    });
  }

  function craftAll(recipe: Recipe) {
    const item = getItem(recipe.result.id);

    if (
      !equals(selection.value.item, AIR) &&
      !equals(selection.value.item, item)
    ) {
      return;
    }

    const trash: Tile = ref(EMPTY);

    let recipeAmount = Math.min(
      ...grid
        .filter((tile) => !equals(tile.value.item, AIR))
        .map((tile) => tile.value.amount)
    );

    const crafted = ref({
      item,
      amount: recipeAmount * recipe.result.count,
    });

    const transferred = transferAll(crafted, inventory.concat(hotbar));

    grid.forEach((tile) => {
      transfer(tile, trash, transferred / recipe.result.count);
    });
  }

  return {
    grid,
    inventory,
    hotbar,
    selection,
    mouse,

    transfer,
    transferAll,
    drop,
    click,
    shiftClick,
    rightClick,
    dblClick,
    mousedown,
    mouseup,
    mouseenter,
    mouseleave,

    craft,
    craftAll,
  };
});
