import { defineStore, storeToRefs } from "pinia";
import { Recipe, Tile } from "@/types";
import { AIR, equals, getItem } from "@/lib/items";
import { computed, ref, unref } from "vue";
import { EMPTY, useWritableTileStore } from "@/stores/writable-tile";
import { useSelectionStore } from "@/stores/selection";
import { getByItems, hasEnoughItems } from "@/lib/recipes";

export const useCraftingGridStore = defineStore("craftingGrid", () => {
  const writableTileStore = useWritableTileStore();
  const { transfer, transferAll, grid, inventory, hotbar } = writableTileStore;

  const selectionStore = useSelectionStore();
  const { selection } = storeToRefs(selectionStore);

  function craft(recipe: Recipe) {
    const item = getItem(recipe.result.id);

    if (
      !equals(selection.value.item, AIR) &&
      !equals(selection.value.item, item)
    ) {
      return;
    }

    // Preview recipe
    if (!craftable.value) {
      grid.forEach((tile) => {
        tile.value = EMPTY;
      });

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

  function resetIfPreview(): boolean {
    // Preview recipe
    if (!craftable.value) {
      grid.forEach((tile) => {
        tile.value = EMPTY;
      });

      return true;
    }

    return false;
  }

  const recipe = computed<Recipe | null>(() => getByItems(grid.map(unref)));
  const amount = computed(() => recipe.value?.result.count ?? 0);
  const item = computed(() => {
    if (!recipe.value) {
      return AIR;
    }

    return getItem(recipe.value.result.id);
  });
  const craftable = computed(() => {
    return recipe.value === null ? true : hasEnoughItems(recipe.value, grid.concat(inventory, hotbar).map(unref));
  });

  return {
    craft,
    craftAll,
    resetIfPreview,

    recipe,
    item,
    amount,
    craftable
  };
});
