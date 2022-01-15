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
          @click.exact="fillGrid(recipe, false)"
          @click.shift.exact="fillGrid(recipe, true)"
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
  craftableAmount,
  hasEnoughItems,
  isShaped,
  padNull,
  recipes,
} from "@/lib/recipes";
import { computed, ref, unref } from "vue";
import RecipeTile from "@/components/RecipeTile.vue";
import { Recipe, Tile } from "@/types";
import { useWritableTileStore } from "@/stores/writable-tile";
import { getItem } from "@/lib/items";
import { useSearch } from "@/lib/searchable";
import Sprite from "@/components/Sprite.vue";

const flatRecipes = Object.values(recipes).flat();

const showingAll = ref(true);

const recipesToShow = computed(() => {
  if (showingAll.value) {
    return flatRecipes;
  }

  return flatRecipes.filter((recipe) => craftable(recipe));
});

const { search, index, page, pages } = useSearch(
  recipesToShow,
  20,
  (item) => getItem(item.result.id).displayName
);

const { grid, inventory, hotbar, transfer, transferAll } =
  useWritableTileStore();

function craftable(recipe: Recipe): boolean {
  return hasEnoughItems(recipe, grid.concat(inventory, hotbar).map(unref));
}

let lastRecipe: Recipe;
let taken: Record<number, Tile> = {};

function fillGrid(recipe: Recipe, all: boolean) {
  if (all || lastRecipe !== recipe) {
    removeRecipe();
  }

  lastRecipe = recipe;
  taken = {};

  let ingredients: (number | null)[];

  if (isShaped(recipe)) {
    ingredients = [...recipe.inShape]
      .reverse()
      .map((row) => padNull(row, 3))
      .flat();
  } else {
    ingredients = recipe.ingredients;
  }

  const amount = all
    ? craftableAmount(recipe, grid.concat(inventory, hotbar).map(unref))
    : 1;

  ingredients.forEach((itemId, index) => {
    if (itemId === null) {
      return;
    }

    const tile = inventory
      .concat(hotbar)
      .find((tile) => tile.value.item.id === itemId);

    if (!tile) {
      return;
    }

    taken[index] = tile;
    transfer(tile, grid[index], amount);
  });
}

function removeRecipe() {
  grid.forEach((tile) => {
    transferAll(tile, inventory.concat(hotbar));
  });
}
</script>
