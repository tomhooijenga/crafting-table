<template>
  <Panel>
    <div class="grid grid-cols-9 overflow-y-auto h-full">
      <GridTile
        v-for="item of items"
        :key="item.id"
        :item="item"
        @click="leftClick($event, item)"
        @contextmenu.prevent="rightClick($event, item)"
      />
    </div>
  </Panel>
</template>

<script setup lang="ts">
import items from "@/assets/data/items.json";
import GridTile from "./GridTile.vue";
import Panel from "./Panel.vue";
import { useStore } from "@/store";
import { Item } from "@/types";
import { AIR, equals } from "@/lib/items";

const store = useStore();

function leftClick(event: MouseEvent, item: Item) {
  const amount = event.shiftKey ? item.stackSize : 1;

  if (equals(store.selection.item, AIR)) {
    store.selection = { item, amount };
  } else if (equals(store.selection.item, item)) {
    store.selection.amount = Math.min(
      store.selection.amount + amount,
      item.stackSize
    );
  }
  // click a different item, drop
  else {
    store.drop();
  }
}

function rightClick(event: MouseEvent, item: Item) {
  // No item means pick up
  if (equals(store.selection.item, AIR)) {
    const amount = event.shiftKey ? item.stackSize : 1;
    store.selection = { item, amount };
  }
  // Last item, drop
  else if (store.selection.amount === 1) {
    store.drop();
  } else {
    store.selection.amount--;
  }
}

// window.addEventListener('mouseup', unselectItem)
// onUnmounted(() => window.removeEventListener('mouseup', unselectItem))
</script>
