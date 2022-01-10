<template>
  <div
    class="fixed top-0 left-0 pointer-events-none"
    :style="`transform: translate(${store.position.x}px, ${store.position.y}px)`"
  >
    <Icon
      class="-translate-x-1/2 -translate-y-1/2"
      :amount="store.selection.amount"
      :item="store.selection.item"
    />
  </div>
</template>
<script setup lang="ts">
import Icon from "./Icon.vue";
import { onMounted, onUnmounted } from "vue";
import { useSelectionStore } from "@/stores/selection";

const store = useSelectionStore();

function mousemove(event: MouseEvent) {
  store.$patch(() => {
    store.position.x = event.clientX;
    store.position.y = event.clientY;
  });
}

onMounted(() => {
  window.addEventListener("mousemove", mousemove);
});
onUnmounted(() => {
  window.removeEventListener("mousemove", mousemove);
});
</script>
