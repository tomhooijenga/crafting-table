<template>
  <section
    ref="root"
    class="flex h-[368px] space-x-2 font-mc text-[#3f3f3f] select-none"
  >
    <RecipeBook v-if="uiStore.showBook" />
    <Panel>
      <CraftingGrid />
      <Inventory />
    </Panel>
    <CreativeInventory />
  </section>
  <HoverIcon />
</template>

<script setup lang="ts">
import CreativeInventory from "@/components/CreativeInventory.vue";
import RecipeBook from "@/components/RecipeBook.vue";
import HoverIcon from "./components/DragIcon.vue";
import CraftingGrid from "./components/CraftingGrid.vue";
import Panel from "./components/Panel.vue";
import Inventory from "@/components/Inventory.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useSelectionStore } from "@/stores/selection";
import { useUIStore } from "@/stores/ui";

const uiStore = useUIStore();
const selectionStore = useSelectionStore();
const root = ref();

function clickOutsideEvent(event: MouseEvent) {
  if (!(root.value == event.target || root.value.contains(event.target))) {
    selectionStore.drop();
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
