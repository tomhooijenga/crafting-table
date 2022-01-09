<template>
  <Panel>
    <div
      class="flex flex-col bg-[#373737] h-full border-2 border-white border-t-black border-l-black p-1.5"
    >
      <div class="grid grid-cols-5 h-auto gap-0.5">
        <RecipeTile
          v-for="recipe of currentPage"
          :key="recipe"
          :recipe="recipe"
          :craftable="craftable(recipe)"
          @click="fillGrid(recipe)"
        />
      </div>
      <div class="flex justify-center mt-auto font-mc text-white text-lg">
        {{ page + 1 }} / {{ Math.ceil(flatRecipes.length / pageSize) }}
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import Panel from "@/components/Panel.vue";
import { hasEnoughItems, isShaped, recipes } from "@/lib/recipes";
import { computed, ref, unref } from "vue";

import RecipeTile from "@/components/RecipeTile.vue";
import { Recipe, Tile } from "@/types";
import { useStore } from "@/store";
import { equals } from "@/lib/items";

const flatRecipes = Object.values(recipes).flat();
const page = ref(0);
const pageSize = 20;

const currentPage = computed(() => {
  const start = page.value * pageSize;
  return flatRecipes.slice(start, start + pageSize);
});

const { grid, inventory, hotbar, transfer } = useStore();

function craftable(recipe: Recipe): boolean {
  return hasEnoughItems(
    recipe,
    inventory.concat(hotbar).map((tile) => unref(tile).item)
  );
}

let lastRecipe: Recipe;
let taken: Record<number, Tile> = {};

function fillGrid(recipe: Recipe) {
  if (lastRecipe !== recipe) {
    removeRecipe();
  }

  lastRecipe = recipe;
  taken = {};

  if (isShaped(recipe)) {
    return;
  }

  recipe.ingredients.forEach((itemId, index) => {
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
