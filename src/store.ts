import { defineStore } from "pinia";
import { ItemAmount } from "./types";
import { AIR, equals } from "@/lib/items";
import { reactive, ref, Ref } from "vue";

type Tile = Ref<Readonly<ItemAmount>>;
const EMPTY = { item: AIR, amount: 0 };

export const useStore = defineStore("selection", () => {
  const selection = ref(EMPTY);
  const tiles = reactive<Tile[]>([]);
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

  function createRegion(amount: number): Tile[] {
    const region = Array.from({ length: amount }).map(() => ref(EMPTY));
    tiles.push(...region);
    return region;
  }

  function tileToSelection(tile: Tile, takeAmount = tile.value.amount): void {
    transfer(tile, selection, takeAmount);
  }

  function selectionToTile(tile: Tile, placeAmount = selection.value.amount): void {
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

  function rightClick(tile: Tile): any {
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

  return {
    selection,
    mouse,

    createRegion,
    drop,
    click,
    rightClick,
  };
});