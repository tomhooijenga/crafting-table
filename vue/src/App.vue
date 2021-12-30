<template>
  <section class="flex flex-col items-center">
    <Inventory class="h-64" />
  </section>
  <HoverIcon />
</template>

<script setup lang="ts">
import Inventory from '@/components/Inventory.vue'
import HoverIcon from "./components/DragIcon.vue";
</script>
