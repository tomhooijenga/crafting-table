<template>
  <img
    v-if="icon.animated"
    :title="item.displayName"
    class="w-8 h-8"
    :src="animated[`/src/assets/icons/${item.name}.gif`].default"
  />
  <div
    v-else
    :title="item.displayName"
    class="relative w-8 h-8 bg-[url('@/assets/sprite.png')]"
    :style="{ backgroundPosition: `-${icon.x}px -${icon.y}px` }"
  >
    <span
      v-if="amount && amount > 1"
      v-text="amount"
      class="text-white [text-shadow:1px_1px_0_black] text-xl leading-none absolute -right-0.5 -bottom-0.5"
    />
  </div>
</template>

<script setup lang="ts">
import { Item, Icon } from "@/types";
import { computed } from "vue";
import { getIcon } from "@/lib/icon";

const props = defineProps<{
  item: Item;
  amount?: number;
}>();

const icon = computed((): Icon => {
  return getIcon(props.item.id.toString());
});

const animated = import.meta.globEager("/src/assets/icons/*.gif");
</script>
