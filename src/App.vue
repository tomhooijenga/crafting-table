<template>
  <section ref="root" class="inline-flex flex-col items-center">
    <CraftingGrid />
    <Inventory class="h-64" />
  </section>
  <HoverIcon />
</template>

<script setup lang="ts">
import Inventory from '@/components/Inventory.vue'
import HoverIcon from "./components/DragIcon.vue";
import CraftingGrid from "./components/CraftingGrid.vue";
import {useSelectionStore} from "./store";
import {ref} from "vue";

const selection = useSelectionStore();
const root = ref();

document.body.addEventListener('click', function clickOutsideEvent (event) {
  if (!(root.value == event.target || root.value.contains(event.target))) {
    selection.drop();
  }
})
</script>
