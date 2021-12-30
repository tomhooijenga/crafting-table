<template>
  <Panel>
    {{selection.amount}}
    <div class="grid grid-cols-9 overflow-y-auto h-full">
      <GridTile v-for="item of items" :key="item.id" :item="item" @click="leftClick($event, item)" @contextmenu.prevent="rightClick($event, item)"/>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import items from '@/assets/data/items.json';
import GridTile from "./GridTile.vue";
import Panel from "./Panel.vue";
import {useSelectionStore} from "../store";
import {Item} from "../types";
import {equals} from "../recipes";

const selection = useSelectionStore();

function leftClick(event: MouseEvent, item: Item) {
  const amount = event.shiftKey ? item.stackSize : 1;

  if (selection.item === null) {
    selection.select(item, amount);
  } else if (equals(selection.item, item)) {
    selection.amount = Math.min(selection.amount + amount, item.stackSize);
  }
  // click a different item, drop
  else {
    selection.drop();
  }
}

function rightClick(event: MouseEvent, item: Item) {
  // No item means pick up
  if (selection.item === null) {
    const amount = event.shiftKey ? item.stackSize : 1;
    selection.select(item, amount);
  }
  // Last item, drop
  else if (selection.amount === 1) {
    selection.drop();
  } else {
    selection.amount--;
  }
}

// window.addEventListener('mouseup', unselectItem)
// onUnmounted(() => window.removeEventListener('mouseup', unselectItem))
</script>
