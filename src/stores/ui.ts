import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", {
  state: () => ({
    showBook: true,
  }),
});
