<template>
  <Panel>
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
            />
          </div>

          <Sprite id="crafting_arrow" class="my-auto mx-[0.875rem]" />

          <GridTile
            class="my-auto h-[3.375rem] w-[3.375rem]"
            :item="craftingGridStore.item"
            :amount="craftingGridStore.amount"
            @click.exact="craft(false)"
            @click.right.exact="craft(false)"
            @click.shift.exact="craft(true)"
            @click.right.shift.exact="craft(true)"
          />
        </div>
      </div>
    </div>

    <span class="text-lg">Inventory</span>
    <div class="grid grid-cols-9">
      <GridTile
        v-for="(n, index) in inventory.length"
        :item="inventory[index].value.item"
        :amount="inventory[index].value.amount"
        @click.exact="writableTileStore.click(inventory[index])"
        @click.right="writableTileStore.rightClick(inventory[index])"
        @click.shift.exact="writableTileStore.shiftClick(inventory[index])"
        @dblclick="writableTileStore.dblClick(inventory[index])"
        @mouseup="writableTileStore.mouseup(inventory[index])"
        @mousedown="writableTileStore.mousedown(inventory[index])"
        @mouseenter="writableTileStore.mouseenter(inventory[index])"
        @mouseleave="writableTileStore.mouseleave(inventory[index])"
      />
    </div>

    <div class="grid grid-cols-9 mt-2">
      <GridTile
        v-for="(n, index) in hotbar.length"
        :item="hotbar[index].value.item"
        :amount="hotbar[index].value.amount"
        @click.exact="writableTileStore.click(hotbar[index])"
        @click.right="writableTileStore.rightClick(hotbar[index])"
        @click.shift.exact="writableTileStore.shiftClick(hotbar[index])"
        @dblclick="writableTileStore.dblClick(hotbar[index])"
        @mousedown="writableTileStore.mousedown(hotbar[index])"
        @mouseup="writableTileStore.mouseup(hotbar[index])"
        @mouseenter="writableTileStore.mouseenter(hotbar[index])"
        @mouseleave="writableTileStore.mouseleave(hotbar[index])"
      />
    </div>
  </Panel>
</template>
<script setup lang="ts">
import Panel from "./Panel.vue";
import GridTile from "./GridTile.vue";
import { getItem } from "@/lib/items";
import { useWritableTileStore } from "@/stores/writable-tile";
import { useUIStore } from "@/stores/ui";
import Sprite from "@/components/Sprite.vue";
import { useCraftingGridStore } from "@/stores/crafting-grid";

const writableTileStore = useWritableTileStore();
const craftingGridStore = useCraftingGridStore();
const uiStore = useUIStore();
const { grid, inventory, hotbar } = writableTileStore;

hotbar[0].value = { item: getItem(37), amount: 8 };
hotbar[1].value = { item: getItem(44), amount: 8 };

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
