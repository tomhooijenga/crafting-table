<template>
  <div
    class="border-2 drop-shadow-[0.125rem_0.125rem_0_black]"
    :class="{
      'border-[#CCCCCC]': craftable,
      'border-[#8A2222]': !craftable,
    }"
  >
    <div
      class="p-0.5 border-2 bg-[#8B8B8B] hover:bg-[#BEBEBE]"
      :class="{
        'border-t-[#373737] border-r-white border-b-white border-l-[#373737]':
          craftable,
        'border-t-[#501b1b] border-r-[#c24f4f] border-b-[#c24f4f] border-l-[#501b1b]':
          !craftable,
      }"
    >
      <Icon :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "@/components/Icon.vue";
import { ShapedRecipe, ShapelessRecipe } from "@/types";
import { computed } from "vue";
import { getItem } from "@/lib/items";

const props = defineProps<{
  recipe: ShapedRecipe | ShapelessRecipe;
  craftable: boolean;
}>();

const item = computed(() => getItem(props.recipe.result.item));
</script>
