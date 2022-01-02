<template>
  <div
    class="fixed top-0 left-0 pointer-events-none"
    :style="`transform: translate(${selection.mouse.x}px, ${selection.mouse.y}px)`"
  >
    <Icon
      v-if="selection.item"
      class="-translate-x-1/2 -translate-y-1/2"
      :amount="selection.amount"
      :item="selection.item"
    />
  </div>
</template>
<script setup lang="ts">
import Icon from "./Icon.vue";
import { useSelectionStore } from "../store";
import { onMounted } from "vue";

const selection = useSelectionStore();

onMounted(() => {
  window.addEventListener("mousemove", (event: MouseEvent) => {
    const { clientX: x, clientY: y } = event;

    selection.mouse = { x, y };
  });
});
</script>
