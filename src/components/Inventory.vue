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
import { useSelectionStore } from "@/store";
import { Item } from "@/types";
import { AIR, equals } from "@/lib/items";

const selection = useSelectionStore();

function leftClick(event: MouseEvent, item: Item) {
  const amount = event.shiftKey ? item.stackSize : 1;

  if (equals(selection.itemAmount.item, AIR)) {
    selection.select({
      item,
      amount,
    });
  } else if (equals(selection.itemAmount.item, item)) {
    selection.itemAmount.amount = Math.min(
      selection.itemAmount.amount + amount,
      item.stackSize
    );
  }
  // click a different item, drop
  else {
    selection.drop();
  }
}

function rightClick(event: MouseEvent, item: Item) {
  // No item means pick up
  if (equals(selection.itemAmount.item, AIR)) {
    const amount = event.shiftKey ? item.stackSize : 1;
    selection.select({
      item,
      amount,
    });
  }
  // Last item, drop
  else if (selection.itemAmount.amount === 1) {
    selection.drop();
  } else {
    selection.itemAmount.amount--;
  }
}

// window.addEventListener('mouseup', unselectItem)
// onUnmounted(() => window.removeEventListener('mouseup', unselectItem))
</script>
