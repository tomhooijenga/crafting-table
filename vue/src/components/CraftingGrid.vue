<template>
  <Panel class="flex flex-row justify-center w-full">
    <div class="grid grid-cols-3">
      <GridTile v-for="(n, index) in 9"
                :item="grid[index].item"
                :amount="grid[index].amount"
                @click="leftClick($event, index)"
                @contextmenu.prevent="rightClick($event, index)"
                @dblclick="dblclick(index)"/>
    </div>
    <div class="w-12 flex items-center justify-center">
      <img src="@/assets/arrow.png"/>
    </div>
    <GridTile class="my-auto" :item="craftedItem" :amount="craftedAmount"/>
  </Panel>
</template>
<script setup lang="ts">

import Panel from "./Panel.vue";
import GridTile from "./GridTile.vue";
import {computed, reactive} from "vue";
import {AIR, getByItems} from '@/recipes'
import {useSelectionStore} from "../store";
import {equals, getItem} from "../recipes";
import {Item} from "../types";

const grid = reactive<{ item: Item; amount: number }>(
  Array.from({length: 9}).map(() => ({
    item: AIR,
    amount: 1,
  }))
)
const selection = useSelectionStore();

function leftClick(event: MouseEvent, index: number) {
  const prev = grid[index];

  // Same and enough room in stack, merge stacks
  if (equals(prev.item, selection.item) && prev.amount + selection.amount <= prev.item.stackSize) {
    prev.amount += selection.amount;
    selection.drop();
  }
  // Not same or stack overflow, swap
  else {
    const next = selection.select(prev.item, prev.amount);

    grid[index] = {
      item: next.item ?? AIR,
      amount: next.amount
    }

    if (equals(prev.item, AIR)) {
      selection.drop();
    }
  }
}

function rightClick(event: MouseEvent, index: number) {
  const prev = grid[index];

  // Air, set to item
  if (equals(prev.item, AIR)) {
    // Will increase directly
    prev.amount = 0;
    prev.item = selection.item;
  }

  if (selection.item === null) {
    const amount = Math.ceil(prev.amount / 2);
    prev.amount -= amount;
    selection.select(prev.item, amount);
  }
  // Same
  else if (equals(prev.item, selection.item)) {
    // If room, increase
    if (prev.amount + 1 <= prev.item.stackSize) {
      prev.amount += 1;
      selection.amount--;

      if (selection.amount === 0) {
        selection.drop();
      }
    }
  }
  // Not same, swap
  else {
    grid[index] = selection.select(prev.item, prev.amount);
  }
}

function dblclick(index: number) {
  const tile = grid[index];

  for (const [i, neighbour] of grid.entries()) {
    if (index === i || !equals(neighbour.item, tile.item)) {
      continue;
    }

    const stackLeft = tile.item.stackSize - tile.amount;

    if (stackLeft === 0) {
      break;
    }

    tile.amount += Math.min(neighbour.amount, stackLeft);
    neighbour.amount -= Math.min(neighbour.amount, stackLeft);

    if (neighbour.amount === 0) {
      neighbour.item = AIR;
    }
  }

  selection.select(tile.item, tile.amount);
  tile.item = AIR;
  tile.amount = 1;
}

const craftedRecipe = computed(() => getByItems(grid));
const craftedItem = computed(() => {
  if (!craftedRecipe.value) {
    return AIR;
  }

  return getItem(craftedRecipe.value.result.id);
});
const craftedAmount = computed(() => craftedRecipe.value?.result.count ?? 0);
</script>
