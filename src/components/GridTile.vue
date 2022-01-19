<template>
  <div
    class="flex justify-center items-center border-2 border-t-[#370501] border-r-white border-b-white border-l-[#370501]"
    :class="{ 'bg-[#8B8B8B]': craftable, 'bg-[#a17171]': !craftable }"
  >
    <div class="hover:bg-white/30">
      <Icon :item="item" :amount="amount" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "@/components/Icon.vue";
import { Item } from "@/types";

withDefaults(defineProps<{
  item: Item;
  amount?: number;
  craftable?: boolean
}>(), {
  craftable: true
});
</script>
