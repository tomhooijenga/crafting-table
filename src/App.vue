<template>
  <section ref="root" class="flex h-[316px] space-x-2">
    <RecipeBook />
    <CraftingGrid />
    <Inventory />
  </section>
  <HoverIcon />
</template>

<script setup lang="ts">
import Inventory from "@/components/Inventory.vue";
import RecipeBook from "@/components/RecipeBook.vue";
import HoverIcon from "./components/DragIcon.vue";
import CraftingGrid from "./components/CraftingGrid.vue";
import { useStore } from "./store";
import { ref } from "vue";

const selection = useStore();
const root = ref();

document.body.addEventListener("click", function clickOutsideEvent(event: MouseEvent) {
  if (!(root.value == event.target || root.value.contains(event.target))) {
    selection.drop();
  }
});

document.body.addEventListener("contextmenu", (e) => e.preventDefault());
</script>
