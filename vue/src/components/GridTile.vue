<template>
  <div class="relative p-0.5 border-2 border-t-[#373737] border-r-[#FFFFFF] border-b-[#FFFFFF] border-l-[#373737] bg-[#8B8B8B] hover:bg-[#BEBEBE]">
    <Icon :item="item" />
    <span v-if="amount && amount > 0" v-text="amount" class="text-white [text-shadow:1px_1px_0_black] leading-none absolute right-0.5 bottom-0.5" />
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/Icon.vue';
import {Item} from "@/types";

defineProps<{
  item: Item,
  amount?: number
}>()
</script>

