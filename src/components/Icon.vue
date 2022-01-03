<template>
  <div :title="item.displayName"
       class="relative w-8 h-8"
       :style="style"
  >
    <span
        v-if="amount && amount > 1"
        v-text="amount"
        class="text-white [text-shadow:1px_1px_0_black] text-xl leading-none absolute -right-0.5 -bottom-0.5"
    />
  </div>
</template>

<script setup lang="ts">
import {Icon, Item} from "@/types";
import {computed} from "vue";
import {getIcon} from "@/lib/icon";
import sprite from '@/assets/sprite.png';

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
      backgroundImage: `url(${animated[`/src/assets/icons/${props.item.name}.gif`].default})`
    }
  }

  return {
    backgroundImage: `url(${sprite})`,
    backgroundPosition: `-${icon.value.x}px -${icon.value.y}px`
  }
})

</script>
