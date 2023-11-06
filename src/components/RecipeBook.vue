<template>
  <Panel>
    <div
      class="flex flex-col bg-[#373737] h-full border-2 border-white border-t-black border-l-black p-1.5"
    >
      <div class="flex flex-row space-x-2 mb-1">
        <Sprite id="recipe_search" />
        <input
          type="text"
          v-model="search"
          placeholder="Search"
          class="placeholder:italic h-6 w-0 flex-1 bg-transparent outline-none text-white caret-white [caret-shape:underscore]"
        />
        <Sprite
          :id="showingAll ? 'recipe_showing_all' : 'recipe_showing_craftable'"
          @click="showingAll = !showingAll"
          :title="showingAll ? 'Showing All' : 'Showing Craftable'"
        />
      </div>

      <div class="grid grid-cols-5 h-auto gap-0.5">
        <span v-if="page.length === 0" class="w-11"></span>
        <RecipeTile
          v-for="recipe of page"
          :recipe="recipe"
          :craftable="craftable(recipe)"
          @click.exact="previewRecipe(recipe, false)"
          @click.shift.exact="previewRecipe(recipe, true)"
        />
      </div>
      <div
        class="grid grid-cols-3 items-center mt-auto text-white text-lg"
        v-if="pages > 1"
      >
        <button v-if="index > 0" class="ml-auto" @click="index--">
          <Sprite id="recipe_arrow_left" />
        </button>
        <span class="col-start-2 text-center">
          {{ index + 1 }} / {{ pages }}
        </span>
        <button v-if="index + 1 < pages" class="mr-auto" @click="index++">
          <Sprite id="recipe_arrow_right" />
        </button>
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import Panel from "@/components/Panel.vue";
import {
  compareRecipeItem,
  craftableAmount,
  hasEnoughItems,
  isShaped,
  recipes,
} from "@/lib/recipes";
import { computed, ref, unref, watch } from "vue";
import RecipeTile from "@/components/RecipeTile.vue";
import { CraftingRecipe, RecipePart } from "@/types";
import { useWritableTileStore } from "@/stores/writable-tile";
import { useCraftingGridStore } from "@/stores/crafting-grid";
import { equals, getItem, getRecipeItems } from "@/lib/items";
import { useSearch } from "@/lib/searchable";
import Sprite from "@/components/Sprite.vue";

const showingAll = ref(true);

const recipesToShow = computed(() => {
  if (showingAll.value) {
    return recipes;
  }

  return recipes.filter((recipe) => craftable(recipe));
});

const { search, index, page, pages } = useSearch(
  recipesToShow,
  20,
  (recipe) => getItem(recipe.result.item).displayName
);

const writableTileStore = useWritableTileStore();
const { grid, inventory, hotbar, transfer, transferAll } = writableTileStore;
const craftingGridStore = useCraftingGridStore();

function craftable(recipe: CraftingRecipe): boolean {
  return hasEnoughItems(recipe, writableTileStore.availableItems);
}

function previewRecipe(recipe: CraftingRecipe, all: boolean) {
  if (
    all ||
    craftingGridStore.recipe !== recipe ||
    !craftingGridStore.craftable
  ) {
    removeRecipe();
  }

  let ingredients: (RecipePart | null)[];

  if (isShaped(recipe)) {
    ingredients = recipe.pattern;
  } else {
    ingredients = recipe.ingredients;
  }

  const amount = all
    ? craftableAmount(recipe, writableTileStore.availableItems)
    : 1;

  if (craftable(recipe)) {
    previewCraftableRecipe(ingredients, amount);
  } else {
    previewUncraftableRecipe(ingredients);
  }
}

function previewCraftableRecipe(
  ingredients: (RecipePart | null)[],
  amount: number
) {
  ingredients.forEach((ingredient, index) => {
    if (ingredient === null) {
      return;
    }

    const tile = inventory
      .concat(hotbar)
      .find((tile) => compareRecipeItem(ingredient, tile.value.item));

    if (!tile) {
      return;
    }

    transfer(tile, grid[index], amount);
  });
}

let intervalId: ReturnType<typeof setInterval>;
function previewUncraftableRecipe(ingredients: (RecipePart | null)[]) {
  clearInterval(intervalId);

  let itemIndex = 0;

  function rotateItems() {
    ingredients.forEach((ingredient, index) => {
      if (ingredient === null) {
        return;
      }

      const possibleItems = getRecipeItems(ingredient);
      const item = possibleItems[itemIndex % possibleItems.length];

      if (!equals(grid[index].value.item, item)) {
        grid[index].value = {
          item,
          amount: 0,
        };
      }
    });

    itemIndex++;
  }

  rotateItems();

  intervalId = setInterval(() => rotateItems(), 1500);
}

watch(
  () => craftingGridStore.recipe,
  (value) => {
    console.log("aw", value, craftingGridStore.craftable);
    if (craftingGridStore.craftable) {
      clearInterval(intervalId);
    }
  }
);

function removeRecipe() {
  if (!craftingGridStore.resetIfPreview()) {
    grid.forEach((tile) => {
      transferAll(tile, inventory.concat(hotbar));
    });
  }
}
</script>
