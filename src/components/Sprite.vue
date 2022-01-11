<template>
  <div
    :style="style"
    class="[image-rendering:pixelated] bg-[length:512px_512px]"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  ></div>
</template>

<script setup lang="ts">
import { SpriteId, sprites } from "@/lib/sprite";
import { computed, ref, StyleValue } from "vue";

const props = defineProps<{ id: SpriteId }>();

const scale = 2;

const hover = ref(false);

function isValidId(id: string): id is SpriteId {
  return id in sprites;
}

const spriteId = computed((): SpriteId => {
  const hoverId = `${props.id}_hover`;
  if (hover.value && isValidId(hoverId)) {
    return hoverId;
  }
  return props.id;
});

const style = computed((): StyleValue => {
  const { url, x, y, width, height } = sprites[spriteId.value];
  return {
    width: `${width * scale}px`,
    height: `${height * scale}px`,
    backgroundImage: `url(${url})`,
    backgroundPosition: `-${x * scale}px -${y * scale}px`,
  };
});
</script>
