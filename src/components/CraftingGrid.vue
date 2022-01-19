<template>
  <div>
    <div class="inline-grid">
      <span class="text-lg col-start-2">Crafting</span>

      <Sprite
          id="crafting_book"
          @click="uiStore.showBook = !uiStore.showBook"
          class="my-auto mr-4"
      />

      <div class="flex">
        <div class="grid grid-cols-3">
          <GridTile
              v-for="(n, index) in grid.length"
              :item="grid[index].value.item"
              :amount="grid[index].value.amount"
              @click.exact="writableTileStore.click(grid[index])"
              @click.right="writableTileStore.rightClick(grid[index])"
              @click.shift.exact="writableTileStore.shiftClick(grid[index])"
              @dblclick="writableTileStore.dblClick(grid[index])"
              @mousedown="writableTileStore.mousedown(grid[index])"
              @mouseup="writableTileStore.mouseup(grid[index])"
              @mouseenter="writableTileStore.mouseenter(grid[index])"
              @mouseleave="writableTileStore.mouseleave(grid[index])"
              :class="{ 'bg-[#a17171]': !craftingGridStore.craftable }"
          />
        </div>

        <Sprite id="crafting_arrow" class="my-auto mx-[0.875rem]" />

        <GridTile
            class="my-auto h-[3.375rem] w-[3.375rem]"
            :item="craftingGridStore.item"
            :amount="craftingGridStore.amount"
            @mousedown="craftingGridStore.resetIfPreview()"
            @click.exact="craft(false)"
            @click.right.exact="craft(false)"
            @click.shift.exact="craft(true)"
            @click.right.shift.exact="craft(true)"
            :class="{ 'bg-[#a17171]': !craftingGridStore.craftable }"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import GridTile from "./GridTile.vue";
import { useWritableTileStore } from "@/stores/writable-tile";
import { useUIStore } from "@/stores/ui";
import Sprite from "@/components/Sprite.vue";
import { useCraftingGridStore } from "@/stores/crafting-grid";

const writableTileStore = useWritableTileStore();
const craftingGridStore = useCraftingGridStore();
const uiStore = useUIStore();
const { grid } = writableTileStore;

function craft(all: boolean) {
  if (craftingGridStore.recipe) {
    if (all) {
      craftingGridStore.craftAll(craftingGridStore.recipe);
    } else {
      craftingGridStore.craft(craftingGridStore.recipe);
    }
  }
}
</script>
