<template>
  <Panel class="grid grid-cols-9 grid-rows-6 overflow-y-auto max-w-fit">
    <GridTile v-for="item of items" :key="item.id" :item="item"/>
  </Panel>
</template>

<script setup lang="ts">
import items from '@/assets/data/items.json';
import GridTile from "./GridTile.vue";
import Panel from "./Panel.vue";
</script>
