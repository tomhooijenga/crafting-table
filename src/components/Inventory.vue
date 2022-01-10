<template>
  <Panel class="flex flex-col pt-0">
    <div
      class="grid grid-cols-9 my-auto flex-1 items-center overflow-y-auto [scrollbar-gutter:stable]"
    >
      <span class="col-span-4"> Search Items </span>
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
          @click="leftClick($event, item)"
          @contextmenu.prevent="rightClick($event, item)"
        />
        <GridTile v-for="i of fill" :key="i" :item="AIR" />
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import GridTile from "./GridTile.vue";
import Panel from "./Panel.vue";
import { useStore } from "@/store";
import { Item } from "@/types";
import { items, AIR, equals } from "@/lib/items";
import { useSearch } from "@/lib/searchable";
import { computed } from "vue";

const store = useStore();

function leftClick(event: MouseEvent, item: Item) {
  const amount = event.shiftKey ? item.stackSize : 1;

  if (equals(store.selection.item, AIR)) {
    store.selection = { item, amount };
  } else if (equals(store.selection.item, item)) {
    store.selection.amount = Math.min(
      store.selection.amount + amount,
      item.stackSize
    );
  }
  // click a different item, drop
  else {
    store.drop();
  }
}

function rightClick(event: MouseEvent, item: Item) {
  // No item means pick up
  if (equals(store.selection.item, AIR)) {
    const amount = event.shiftKey ? item.stackSize : 1;
    store.selection = { item, amount };
  }
  // Last item, drop
  else if (store.selection.amount === 1) {
    store.drop();
  } else {
    store.selection.amount--;
  }
}

const fill = computed(() => Math.max(Math.ceil(page.value.length / 9) * 9, 72));

// Skip air
const itemsArray = Object.values(items).slice(1);
const { page, search } = useSearch(itemsArray, itemsArray.length, (item) =>
  item.displayName.toLowerCase()
);
</script>
