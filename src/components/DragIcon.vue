<template>
  <div
    class="fixed top-0 left-0 pointer-events-none"
    :style="`transform: translate(${store.mouse.x}px, ${store.mouse.y}px)`"
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
import { useStore } from "@/store";
import { onMounted } from "vue";

const store = useStore();

onMounted(() => {
  window.addEventListener("mousemove", (event: MouseEvent) => {
    const { clientX: x, clientY: y } = event;

    store.mouse = { x, y };
  });
});
</script>
