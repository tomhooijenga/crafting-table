<template>
  <section ref="root" class="flex h-[368px] space-x-2 font-mc">
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
import { ref, onMounted, onUnmounted } from "vue";

const selection = useStore();
const root = ref();

function clickOutsideEvent(event: MouseEvent) {
  if (!(root.value == event.target || root.value.contains(event.target))) {
    selection.drop();
  }
}

function prevent(e: MouseEvent) {
  e.preventDefault();
}

onMounted(() => {
  document.body.addEventListener("click", clickOutsideEvent);
  document.body.addEventListener("contextmenu", prevent);
});

onUnmounted(() => {
  document.body.removeEventListener("click", clickOutsideEvent);
  document.body.removeEventListener("contextmenu", prevent);
});
</script>
