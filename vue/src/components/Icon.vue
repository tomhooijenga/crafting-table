<template>
  <img v-if="icon.animated"
       class="w-8 h-8"
       :src="animated[`/src/assets/icons/${item.name}.gif`].default"
  />
  <div v-else
       :title="item.displayName"
       class="w-8 h-8 bg-[url('@/assets/sprite.png')]"
       :style="{ backgroundPosition: `-${icon.x}px -${icon.y}px` }">
  </div>
</template>

<script setup lang="ts">
import sprite from '@/assets/data/sprite.json';
import {Item, Icon} from "@/types";
import {computed} from "vue";

const props = defineProps<{
  item: Item
}>()

const icon = computed<Icon>(() => {
  return sprite[props.item.id];
});

const animated = import.meta.globEager('/src/assets/icons/*.gif');
</script>
