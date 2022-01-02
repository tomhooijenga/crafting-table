import { defineStore } from "pinia";
import { Item, ItemAmount } from "./types";
import { AIR } from "@/lib/items";

export const useSelectionStore = defineStore("selection", {
  state: (): {
    itemAmount: ItemAmount;
    mouse: { x: number; y: number };
  } => ({
    itemAmount: {
      item: AIR,
      amount: 0,
    },
    mouse: { x: 0, y: 0 },
  }),
  actions: {
    select(itemAmount: ItemAmount): ItemAmount {
      const { itemAmount: oldItemAmount } = this;

      this.itemAmount = itemAmount;

      return oldItemAmount;
    },
    drop(): void {
      this.itemAmount = {
        item: AIR,
        amount: 1,
      };
    },
  },
});
