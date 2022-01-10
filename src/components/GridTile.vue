<template>
  <div
    class="flex justify-center items-center border-2 border-t-[#370501] border-r-white border-b-white border-l-[#370501] bg-[#8B8B8B]"
  >
    <div class="hover:bg-[#BEBEBE]">
      <Icon :item="item" :amount="amount" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "@/components/Icon.vue";
import { Item } from "@/types";

defineProps<{
  item: Item;
  amount?: number;
}>();
</script>
