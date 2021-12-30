<template>
  <section class="inline-flex flex-col items-center">
    <CraftingGrid />
    <Inventory class="h-64" />
  </section>
  <HoverIcon />
</template>

<script setup lang="ts">
import Inventory from '@/components/Inventory.vue'
import HoverIcon from "./components/DragIcon.vue";
import CraftingGrid from "./components/CraftingGrid.vue";
</script>
