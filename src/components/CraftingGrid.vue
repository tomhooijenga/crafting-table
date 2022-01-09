<template>
  <Panel>
    <div class="flex justify-center">
      <div class="inline-grid grid-flow-row auto-rows-max">
        <span class="font-mc text-[#3f3f3f] text-lg">Crafting</span>
        <div class="flex">
          <div class="grid grid-cols-3">
            <GridTile
              v-for="(n, index) in grid.length"
              :item="grid[index].value.item"
              :amount="grid[index].value.amount"
              @click.exact="store.click(grid[index])"
              @click.right="store.rightClick(grid[index])"
              @click.shift.exact="store.shiftClick(grid[index])"
              @dblclick="store.dblClick(grid[index])"
              @mousedown="store.mousedown(grid[index])"
              @mouseup="store.mouseup(grid[index])"
              @mouseenter="store.mouseenter(grid[index])"
              @mouseleave="store.mouseleave(grid[index])"
            />
          </div>
          <div class="w-12 flex items-center justify-center">
            <img src="@/assets/arrow.png" />
          </div>
          <GridTile
            class="my-auto"
            :item="craftedItem"
            :amount="craftedAmount"
            @click.exact="craft(false)"
            @click.right.exact="craft(false)"
            @click.shift.exact="craft(true)"
            @click.right.shift.exact="craft(true)"
          />
        </div>
      </div>
    </div>

    <span class="font-mc text-[#3f3f3f] text-lg">Inventory</span>
    <div class="grid grid-cols-9">
      <GridTile
        v-for="(n, index) in inventory.length"
        :item="inventory[index].value.item"
        :amount="inventory[index].value.amount"
        @click.exact="store.click(inventory[index])"
        @click.right="store.rightClick(inventory[index])"
        @click.shift.exact="store.shiftClick(inventory[index])"
        @dblclick="store.dblClick(inventory[index])"
        @mouseup="store.mouseup(inventory[index])"
        @mousedown="store.mousedown(inventory[index])"
        @mouseenter="store.mouseenter(inventory[index])"
        @mouseleave="store.mouseleave(inventory[index])"
      />
    </div>

    <div class="grid grid-cols-9 mt-2">
      <GridTile
        v-for="(n, index) in hotbar.length"
        :item="hotbar[index].value.item"
        :amount="hotbar[index].value.amount"
        @click.exact="store.click(hotbar[index])"
        @click.right="store.rightClick(hotbar[index])"
        @click.shift.exact="store.shiftClick(hotbar[index])"
        @dblclick="store.dblClick(hotbar[index])"
        @mousedown="store.mousedown(hotbar[index])"
        @mouseup="store.mouseup(hotbar[index])"
        @mouseenter="store.mouseenter(hotbar[index])"
        @mouseleave="store.mouseleave(hotbar[index])"
      />
    </div>
  </Panel>
</template>
<script setup lang="ts">
import Panel from "./Panel.vue";
import GridTile from "./GridTile.vue";
import { computed, unref } from "vue";
import { getByItems } from "@/lib/recipes";
import { Recipe } from "@/types";
import { AIR, getItem } from "@/lib/items";
import { useStore } from "@/store";

const store = useStore();
const { grid, inventory, hotbar } = store;

// const grid = store.createRegion(9);
// const inventory = store.createRegion(27);
// const hotbar = store.createRegion(9);

hotbar[0].value = { item: getItem(37), amount: 8 };
hotbar[1].value = { item: getItem(44), amount: 8 };

const craftedRecipe = computed<Recipe | null>(() =>
  getByItems(grid.map(unref))
);

const craftedItem = computed(() => {
  if (!craftedRecipe.value) {
    return AIR;
  }

  return getItem(craftedRecipe.value.result.id);
});
const craftedAmount = computed(() => craftedRecipe.value?.result.count ?? 0);

function craft(all: boolean) {
  if (craftedRecipe.value) {
    if (all) {
      store.craftAll(craftedRecipe.value);
    } else {
      store.craft(craftedRecipe.value);
    }
  }
}
</script>
