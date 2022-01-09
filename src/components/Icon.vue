<template>
  <div :title="item.displayName" class="relative w-8 h-8" :style="style">
    <span
      v-if="amount && amount > 1"
      v-text="amount"
      class="text-white [text-shadow:2px_2px_0_rgba(0,0,0,0.5)] text-xl leading-none absolute -right-1 -bottom-1.5 pointer-events-none"
    />
  </div>
</template>

<script setup lang="ts">
import { Icon, Item } from "@/types";
import { computed } from "vue";
import { getIcon } from "@/lib/icons";
import sprite from "@/assets/sprite.png";

const props = defineProps<{
  item: Item;
  amount?: number;
}>();

const icon = computed((): Icon => {
  return getIcon(props.item.id.toString());
});

const animated = import.meta.globEager("/src/assets/icons/*.gif");

const style = computed(() => {
  if (icon.value.animated) {
    return {
      backgroundImage: `url(${
        animated[`/src/assets/icons/${props.item.name}.gif`].default
      })`,
    };
  }

  return {
    backgroundImage: `url(${sprite})`,
    backgroundPosition: `-${icon.value.x}px -${icon.value.y}px`,
  };
});
</script>
