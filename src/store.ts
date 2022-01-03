import { defineStore } from "pinia";
import { ItemAmount } from "./types";
import { AIR, equals } from "@/lib/items";
import { ref, Ref } from "vue";

type Tile = Ref<Readonly<ItemAmount>>;
const EMPTY = { item: AIR, amount: 0 };

export const useStore = defineStore("selection", {
  state: (): {
    selection: ItemAmount;
    tiles: Tile[];
    mouse: { x: number; y: number };
  } => ({
    selection: {
      item: AIR,
      amount: 0,
    },
    tiles: [],
    mouse: { x: 0, y: 0 },
  }),
  actions: {
    createRegion(amount: number): Tile[] {
      const region = Array.from({ length: amount }).map(() => ref(EMPTY));
      this.tiles.push(...region);
      return region;
    },

    drop(): void {
      this.selection = EMPTY;
    },
    tileToSelection(tile: Tile, takeAmount = tile.value.amount): void {
      const { item, amount } = tile.value;
      const newAmount = amount - takeAmount;

      tile.value = {
        item: newAmount > 0 ? item : AIR,
        amount: newAmount,
      };

      this.selection = {
        item,
        amount: takeAmount,
      };
    },
    selectionToTile(tile: Tile, placeAmount = this.selection.amount) {
      const { amount } = tile.value;
      const { item } = this.selection;

      const tileAmount = amount + placeAmount;
      const selectionAmount = this.selection.amount - placeAmount;

      if (item.stackSize >= tileAmount) {
        tile.value = {
          item,
          amount: tileAmount,
        };

        this.selection = {
          item: selectionAmount > 0 ? item : AIR,
          amount: selectionAmount,
        };
      }
    },
    swap(tile: Tile) {
      const { item, amount } = tile.value;
      tile.value = this.selection;
      this.selection = { item, amount };
    },
    click(tile: Tile): void {
      const { item } = tile.value;

      // Selection is air, take tile
      if (equals(this.selection.item, AIR)) {
        this.tileToSelection(tile);
      }
      // Selection is same as tile, place on tile
      else if (equals(this.selection.item, item)) {
        this.selectionToTile(tile);
      }
      // Tile is air, place selection on tile
      else if (equals(item, AIR)) {
        this.selectionToTile(tile);
      }
      // Items are not same, swap
      else {
        this.swap(tile);
      }
    },
    rightClick(tile: Tile): any {
      const { item, amount } = tile.value;

      // Selection is air, take half of tile
      if (equals(this.selection.item, AIR)) {
        this.tileToSelection(tile, Math.ceil(amount / 2));
      }
      // Selection is same as tile, place 1 on tile
      else if (equals(this.selection.item, item)) {
        this.selectionToTile(tile, 1);
      }
      // Tile is air, place 1 on tile
      else if (equals(item, AIR)) {
        this.selectionToTile(tile, 1);
      }
      // Items are not same, swap
      else {
        this.swap(tile);
      }
    },
  },
});
