<template>
  <Panel>
    <div class="flex flex-row justify-center w-full">
      <div class="grid grid-cols-3">
        <GridTile
          v-for="(n, index) in grid.length"
          :item="grid[index].value.item"
          :amount="grid[index].value.amount"
          @click="store.click(grid[index])"
          @contextmenu.prevent="store.rightClick(grid[index])"
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
        @click="store.click(inventory[index])"
        @contextmenu.prevent="store.rightClick(inventory[index])"
      />
    </div>

    <div class="grid grid-cols-9 mt-2">
      <GridTile
        v-for="(n, index) in hotbar.length"
        :item="hotbar[index].value.item"
        :amount="hotbar[index].value.amount"
        @click="store.click(hotbar[index])"
        @contextmenu.prevent="store.rightClick(hotbar[index])"
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
hotbar[1].value = { item: getItem(45), amount: 8 };

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
