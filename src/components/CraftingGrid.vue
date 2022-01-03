<template>
  <Panel>
    <div class="flex flex-row justify-center w-full">
      <div class="grid grid-cols-3">
        <GridTile
          v-for="(n, index) in grid.length"
          :item="grid[index].value.item"
          :amount="grid[index].value.amount"
          @click.exact="store.click(grid[index])"
          @click.right="store.rightClick(grid[index])"
          @click.shift.exact="store.shiftClick(grid[index])"
          @dblclick="store.dblClick(grid[index])"
        />
      </div>
      <div class="w-12 flex items-center justify-center">
        <img src="@/assets/arrow.png" />
      </div>
      <GridTile class="my-auto" :item="craftedItem" :amount="craftedAmount" />
    </div>

    <div class="grid grid-cols-9 mt-2">
      <GridTile
        v-for="(n, index) in inventory.length"
        :item="inventory[index].value.item"
        :amount="inventory[index].value.amount"
        @click.exact="store.click(inventory[index])"
        @click.right="store.rightClick(inventory[index])"
        @click.shift.exact="store.shiftClick(inventory[index])"
        @dblclick="store.dblClick(inventory[index])"
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
      />
    </div>
  </Panel>
</template>
<script setup lang="ts">
import Panel from "./Panel.vue";
import GridTile from "./GridTile.vue";
import { computed, reactive, ref, shallowReactive } from "vue";
import { getByItems } from "@/lib/recipes";
import { ItemAmount, ItemRecipe, ShapedRecipe, UnshapedRecipe } from "@/types";
import { AIR, getItem } from "@/lib/items";
import { useStore } from "@/store";

const store = useStore();

const grid = store.createRegion(9);
const inventory = store.createRegion(27);
const hotbar = store.createRegion(9);

hotbar[0].value = { item: getItem(44), amount: 8 };
hotbar[1].value = { item: getItem(44), amount: 8 };

// let isMouseDown = false;
// let startAmount = 0;
// const smeared = new Set<number>();
//
// function mousedown() {
//   isMouseDown = true;
//   startAmount = selection.itemAmount.amount;
// }
//
// function mouseup(index: number) {
//   isMouseDown = false;
//   const amount = [...smeared]
//     .map((index) => grid[index].amount)
//     .reduce((sum, amount) => sum + amount, 0);
//   selection.itemAmount.amount -= amount;
//   smeared.clear();
// }
//
// function mouseleave(index: number) {
//   if (smeared.size === 0) {
//     mouseenter(index);
//   }
// }
//
// function mouseenter(index: number) {
//   const tile = grid[index];
//   const validItem =
//     equals(tile.item, AIR) || equals(tile.item, selection.itemAmount.item);
//
//   if (isMouseDown && validItem && selection.itemAmount.item) {
//     smeared.add(index);
//
//     const amount = Math.floor(startAmount / smeared.size);
//
//     grid[index].item = selection.itemAmount.item;
//     selection.itemAmount.amount = startAmount - amount * smeared.size;
//
//     smeared.forEach((index) => {
//       grid[index].amount = amount;
//     });
//
//     // Placed last of stack, drop
//     if (amount === 1 && smeared.size === startAmount) {
//       selection.drop();
//     }
//   }
// }
//
const craftedRecipe = computed<UnshapedRecipe | ShapedRecipe | null>(
  () => null
);
// const craftedRecipe = computed(() => getByItems(grid));
const craftedItem = computed(() => {
  if (!craftedRecipe.value) {
    return AIR;
  }

  return getItem(craftedRecipe.value.result.id);
});
const craftedAmount = computed(() => craftedRecipe.value?.result.count ?? 0);
</script>
