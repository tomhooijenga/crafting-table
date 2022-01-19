<template>
  <span class="text-lg">Inventory</span>
  <div class="grid grid-cols-9">
    <GridTile
      v-for="(n, index) in inventory.length"
      :item="inventory[index].value.item"
      :amount="inventory[index].value.amount"
      @click.exact="writableTileStore.click(inventory[index])"
      @click.right="writableTileStore.rightClick(inventory[index])"
      @click.shift.exact="writableTileStore.shiftClick(inventory[index])"
      @dblclick="writableTileStore.dblClick(inventory[index])"
      @mouseup="writableTileStore.mouseup(inventory[index])"
      @mousedown="writableTileStore.mousedown(inventory[index])"
      @mouseenter="writableTileStore.mouseenter(inventory[index])"
      @mouseleave="writableTileStore.mouseleave(inventory[index])"
    />
  </div>

  <div class="grid grid-cols-9 mt-2">
    <GridTile
      v-for="(n, index) in hotbar.length"
      :item="hotbar[index].value.item"
      :amount="hotbar[index].value.amount"
      @click.exact="writableTileStore.click(hotbar[index])"
      @click.right="writableTileStore.rightClick(hotbar[index])"
      @click.shift.exact="writableTileStore.shiftClick(hotbar[index])"
      @dblclick="writableTileStore.dblClick(hotbar[index])"
      @mousedown="writableTileStore.mousedown(hotbar[index])"
      @mouseup="writableTileStore.mouseup(hotbar[index])"
      @mouseenter="writableTileStore.mouseenter(hotbar[index])"
      @mouseleave="writableTileStore.mouseleave(hotbar[index])"
    />
  </div>
</template>

<script setup lang="ts">
import GridTile from "./GridTile.vue";
import { useWritableTileStore } from "@/stores/writable-tile";

const writableTileStore = useWritableTileStore();
const { inventory, hotbar } = writableTileStore;
</script>
