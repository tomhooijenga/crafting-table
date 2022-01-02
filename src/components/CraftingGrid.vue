<template>
  <Panel>
    <div class="flex flex-row justify-center w-full">
      <div class="grid grid-cols-3">
        <GridTile
            v-for="(n, index) in grid.length"
            :item="grid[index].value.item"
            :amount="grid[index].value.amount"
        />
      </div>
      <div class="w-12 flex items-center justify-center">
        <img src="@/assets/arrow.png"/>
      </div>
      <GridTile class="my-auto" :item="craftedItem" :amount="craftedAmount"/>
    </div>

    <div class="grid grid-cols-9 mt-2">
      <GridTile
          v-for="(n, index) in inventory.length"
          :item="inventory[index].value.item"
          :amount="inventory[index].value.amount"
      />
    </div>

    <div class="grid grid-cols-9 mt-2">
      <GridTile
          v-for="(n, index) in hotbar.length"
          :item="hotbar[index].value.item"
          :amount="hotbar[index].value.amount"
      />
    </div>
  </Panel>
</template>
<script setup lang="ts">
import Panel from "./Panel.vue";
import GridTile from "./GridTile.vue";
import {computed, ref} from "vue";
import { getByItems } from "@/lib/recipes";
// import { useSelectionStore } from "@/store";
import {ItemAmount, ItemRecipe, ShapedRecipe, UnshapedRecipe} from "@/types";
import {AIR, getItem} from "@/lib/items";
//
const grid = Array
    .from({length: 9})
    .map(() => ref<Readonly<ItemAmount>>({
      item: AIR,
      amount: 1,
    }))
const inventory = Array
    .from({length: 27})
    .map(() => ref<Readonly<ItemAmount>>({
      item: AIR,
      amount: 1,
    }))
const hotbar = Array
    .from({length: 9})
    .map(() => ref<Readonly<ItemAmount>>({
      item: AIR,
      amount: 1,
    }))



// const selection = useSelectionStore();
//
// function leftClick(index: number) {
//   const prev = grid[index];
//
//   // Same and enough room in stack, merge stacks
//   if (
//     equals(prev.item, selection.itemAmount.item) &&
//     prev.amount + selection.itemAmount.amount <= prev.item.stackSize
//   ) {
//     prev.amount += selection.itemAmount.amount;
//     selection.drop();
//   }
//   // Not same or stack overflow, swap
//   else {
//     const next = selection.select(prev);
//
//     grid[index] = {
//       item: next.item,
//       amount: next.amount,
//     };
//
//     if (equals(prev.item, AIR)) {
//       selection.drop();
//     }
//   }
// }
//
// function rightClick(index: number) {
//   const prev = grid[index];
//
//   // Air, set to item
//   if (equals(prev.item, AIR)) {
//     // Will increase directly
//     prev.amount = 0;
//     prev.item = selection.itemAmount.item;
//   }
//
//   if (equals(selection.itemAmount.item, AIR)) {
//     const amount = Math.ceil(prev.amount / 2);
//     prev.amount -= amount;
//     selection.select({
//       item: prev.item,
//       amount: 0,
//     });
//   }
//   // Same
//   else if (equals(prev.item, selection.itemAmount.item)) {
//     // If room, increase
//     if (prev.amount + 1 <= prev.item.stackSize) {
//       prev.amount += 1;
//       selection.itemAmount.amount--;
//
//       if (selection.itemAmount.amount === 0) {
//         selection.drop();
//       }
//     }
//   }
//   // Not same, swap
//   else {
//     grid[index] = selection.select(prev);
//   }
// }
//
// function dblclick(index: number) {
//   const tile = grid[index];
//
//   for (const [i, neighbour] of grid.entries()) {
//     if (index === i || !equals(neighbour.item, tile.item)) {
//       continue;
//     }
//
//     const stackLeft = tile.item.stackSize - tile.amount;
//
//     if (stackLeft === 0) {
//       break;
//     }
//
//     tile.amount += Math.min(neighbour.amount, stackLeft);
//     neighbour.amount -= Math.min(neighbour.amount, stackLeft);
//
//     if (neighbour.amount === 0) {
//       neighbour.item = AIR;
//     }
//   }
//   selection.select({ ...tile });
//   tile.item = AIR;
//   tile.amount = 1;
// }
//
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
const craftedRecipe = computed<UnshapedRecipe | ShapedRecipe | null>(() => null);
// const craftedRecipe = computed(() => getByItems(grid));
const craftedItem = computed(() => {
  if (!craftedRecipe.value) {
    return AIR;
  }

  return getItem(craftedRecipe.value.result.id);
});
const craftedAmount = computed(() => craftedRecipe.value?.result.count ?? 0);
</script>
