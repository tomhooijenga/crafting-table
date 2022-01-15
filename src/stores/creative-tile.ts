import { defineStore } from "pinia";
import { Item } from "@/types";
import { AIR, equals } from "@/lib/items";
import { toRef } from "vue";
import { useSelectionStore } from "@/stores/selection";

export const useCreativeTileStore = defineStore("creativeTile", () => {
  const selectionStore = useSelectionStore();
  const selection = toRef(selectionStore, "selection");

  function take(item: Item, amount: number) {
    if (equals(selectionStore.selection.item, AIR)) {
      selectionStore.selection = { item, amount };
    } else if (equals(selectionStore.selection.item, item)) {
      selectionStore.selection.amount = Math.min(
        selectionStore.selection.amount + amount,
        item.stackSize
      );
    }
    // click a different item, drop
    else {
      selectionStore.drop();
    }
  }

  function click(item: Item) {
    take(item, 1);
  }

  function shiftclick(item: Item) {
    take(item, item.stackSize);
  }

  function drop(item: Item, amount: number) {
    // No item means pick up
    if (equals(selectionStore.selection.item, AIR)) {
      selectionStore.selection = { item, amount };
    }
    // Last item, drop
    else if (selectionStore.selection.amount === 1) {
      selectionStore.drop();
    } else {
      selectionStore.selection.amount--;
    }
  }

  function rightclick(item: Item) {
    drop(item, 1);
  }

  function shiftrightclick(item: Item) {
    drop(item, item.stackSize);
  }

  return {
    click,
    shiftclick,
    rightclick,
    shiftrightclick,
  };
});
