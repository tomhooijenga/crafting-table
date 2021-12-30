import {defineStore} from 'pinia';
import {Item} from './types';

export const useSelectionStore = defineStore('selection', {
  state: (): {
    item: Item | null;
    mouse: {x: number; y: number; }
  } => ({
    item: null,
    mouse: {x: 0, y: 0}
  })
});
