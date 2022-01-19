<template>
  <Panel class="flex flex-col pt-0">
    <div
      class="grid grid-cols-9 my-auto flex-1 items-center overflow-y-auto [scrollbar-gutter:stable]"
    >
      <span class="col-span-4 text-lg">Search Items</span>
      <input
        type="text"
        v-model="search"
        class="placeholder:italic h-6 col-span-5 p-0.5 border-2 border-t-[#370501] border-r-white border-b-white border-l-[#370501] bg-[#8B8B8B] outline-none text-white caret-white [caret-shape:underscore]"
      />
    </div>
    <div
      class="h-80 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] border-2 border-t-[#370501] border-r-white border-b-white border-l-[#370501]"
    >
      <div class="grid grid-cols-9 auto-rows-min -m-[2px]">
        <GridTile
          v-for="item of page"
          :key="item.id"
          :item="item"
          @click.exact="createTileStore.click(item)"
          @click.shift.exact="createTileStore.shiftclick(item)"
          @click.right="createTileStore.rightclick(item)"
          @click.shift.right.exact="createTileStore.shiftrightclick(item)"
        />
        <GridTile v-for="i of fill" :key="i" :item="AIR" />
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import GridTile from "./GridTile.vue";
import Panel from "./Panel.vue";
import { items, AIR } from "@/lib/items";
import { useSearch } from "@/lib/searchable";
import { computed } from "vue";
import { useCreativeTileStore } from "@/stores/creative-tile";

const createTileStore = useCreativeTileStore();

const fill = computed(() => Math.max(Math.ceil(page.value.length / 9) * 9, 72));

const itemsArray = Object.values(items);
const { page, search } = useSearch(itemsArray, itemsArray.length, (item) =>
  item.displayName.toLowerCase()
);
</script>
