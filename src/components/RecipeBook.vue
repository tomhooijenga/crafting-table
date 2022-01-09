<template>
  <Panel>
    <div
      class="flex flex-col bg-[#373737] h-full border-2 border-white border-t-black border-l-black p-1.5"
    >
      <div class="mb-3">
        <input
          type="text"
          v-model="search"
          placeholder="Search"
          class="placeholder:italic h-6 w-full bg-transparent outline-none text-white caret-white [caret-shape:underscore]"
        />
      </div>

      <div class="grid grid-cols-5 h-auto gap-0.5">
        <RecipeTile
          v-for="recipe of currentPage"
          :key="recipe"
          :recipe="recipe"
          :craftable="craftable(recipe)"
          @click.exact="fillGrid(recipe, false)"
          @click.shift.exact="fillGrid(recipe, true)"
        />
      </div>
      <div
        class="grid grid-cols-3 mt-auto text-white text-lg"
        v-if="pageCount > 1"
      >
        <button class="ml-auto" v-if="page > 0" @click="page--">&lt;</button>
        <span class="col-start-2 text-center"
          >{{ page + 1 }} / {{ pageCount }}</span
        >
        <button class="mr-auto" v-if="page + 1 < pageCount" @click="page++">
          &gt;
        </button>
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import Panel from "@/components/Panel.vue";
import { hasEnoughItems, isShaped, padNull, recipes } from "@/lib/recipes";
import { computed, ref, unref, watch } from "vue";
import RecipeTile from "@/components/RecipeTile.vue";
import { Recipe, Tile } from "@/types";
import { useStore } from "@/store";
import { getItem } from "@/lib/items";

const flatRecipes = Object.values(recipes).flat();

const search = ref("");
const page = ref(0);
const pageSize = 20;

function contains(query: string, string: string): boolean {
  if (!query) {
    return true;
  }

  let lastIndex = 0;
  for (const char of query) {
    const newIndex = string.indexOf(char, lastIndex);

    if (newIndex === -1) {
      return false;
    }

    lastIndex = newIndex;
  }
  return true;
}

const searchResult = computed(() => {
  const query = search.value.trim().toLowerCase();
  return flatRecipes.filter((recipe) => {
    const item = getItem(recipe.result.id);

    return contains(query, item.displayName.toLowerCase());
  });
});

const pageCount = computed(() => {
  return Math.ceil(searchResult.value.length / pageSize);
});

watch(pageCount, (count) => {
  if (count < page.value) {
    page.value = 0;
  }
});

const currentPage = computed(() => {
  const start = page.value * pageSize;
  return searchResult.value.slice(start, start + pageSize);
});

const { grid, inventory, hotbar, transfer, transferAll } = useStore();

function craftable(recipe: Recipe): boolean {
  return hasEnoughItems(
    recipe,
    grid.concat(inventory, hotbar).map((tile) => unref(tile))
  );
}

let lastRecipe: Recipe;
let taken: Record<number, Tile> = {};

function fillGrid(recipe: Recipe, all: boolean) {
  if (lastRecipe !== recipe) {
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
    transfer(tile, grid[index], 1);
  });
}

function removeRecipe() {
  grid.forEach((tile) => {
    transferAll(tile, inventory.concat(hotbar));
  });
}
</script>
