<template>
  <Panel class="max-w-fit">
    <div class="grid grid-cols-9 overflow-y-auto h-full">
      <GridTile v-for="item of items" :key="item.id" :item="item" @mousedown="selectItem(item)"/>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import items from '@/assets/data/items.json';
import GridTile from "./GridTile.vue";
import Panel from "./Panel.vue";
import {useSelectionStore} from "../store";
import {Item} from "../types";
import {onUnmounted} from "vue";

const store = useSelectionStore();

function selectItem(item: Item) {
  store.item = item;
}

function unselectItem() {
  store.item = null;
}

window.addEventListener('mouseup', unselectItem)
onUnmounted(() => window.removeEventListener('mouseup', unselectItem))
</script>
