<template>
  <Panel class="flex flex-row justify-center w-full">
    <div class="grid grid-cols-3">
      <GridTile v-for="(n, index) in 9"
                :item="grid[index]"
                @click="dropItem(index)" />
    </div>
    <div class="w-12 flex items-center justify-center">
      <img src="@/assets/arrow.png" />
    </div>
    <GridTile class="my-auto" :item="craftedItem" :amount="craftedAmount" />
  </Panel>
</template>
<script setup lang="ts">

import Panel from "./Panel.vue";
import GridTile from "./GridTile.vue";
import {computed, ref} from "vue";
import { AIR, getByItems } from '@/recipes'
import {useSelectionStore} from "../store";
import {getItem} from "../recipes";

const grid = ref(new Array(9).fill(AIR))
const selection = useSelectionStore();

function dropItem(index: number) {
  if (selection.item) {
    grid.value[index] = selection.item;
    selection.item = null;
  } else {
    selection.item = grid.value[index]
    grid.value[index] = AIR;
  }
}

const craftedRecipe = computed(() => getByItems(grid.value));
const craftedItem = computed(() => {
  if (!craftedRecipe.value) {
    return AIR;
  }

  return getItem(craftedRecipe.value.result.id);
});
const craftedAmount = computed(() => craftedRecipe.value?.result.count ?? 0)
</script>
