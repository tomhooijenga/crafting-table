import { EMPTY } from "@/stores/writable-tile";
import { defineStore } from "pinia";

export const useSelectionStore = defineStore("selection", {
  state: () => ({
    selection: EMPTY,
    position: { x: 0, y: 0 },
  }),
  actions: {
    drop() {
      this.selection = EMPTY;
    },
  },
});
