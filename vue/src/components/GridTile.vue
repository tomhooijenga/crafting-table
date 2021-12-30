<template>
  <div class="relative p-0.5 border-2 border-t-[#373737] border-r-[#FFFFFF] border-b-[#FFFFFF] border-l-[#373737] bg-[#8B8B8B] hover:bg-[#BEBEBE]">
    <Icon :item="item" :amount="amount" />
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

