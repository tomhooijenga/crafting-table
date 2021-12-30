import {defineStore} from 'pinia';
import {Item} from './types';

export const useSelectionStore = defineStore('selection', {
  state: (): {
    item: Item | null;
    amount: number;
    mouse: { x: number; y: number; }
  } => ({
    item: null,
    amount: 1,
    mouse: {x: 0, y: 0}
  }),
  actions: {
    select(item: Item, amount = 1): { item: Item, amount: number } {
      const {item: oldItem, amount: oldAmount} = this;

      this.item = item;
      this.amount = amount;

      return {item: oldItem, amount: oldAmount};
    },
    drop(): void {
      this.item = null;
      this.amount = 1;
    },
  }
});
