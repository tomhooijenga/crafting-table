<template>
  <section class="p-2 border-2 bg-[#C6C6C6] [border-color:#DBDBDB #5B5B5B #5B5B5B #DBDBDB]">
    <GridTile v-for="item of items" :key="item.id" :item="item"/>
  </section>
</template>

<script setup lang="ts">
import items from '@/assets/data/items.json';
import GridTile from "./GridTile.vue";
</script>
