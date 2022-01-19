import _items from "@/assets/data/items.json";
import { Item, Tile } from "@/types";

export const items = _items as Record<string, Item>;

export const AIR: Readonly<Item> = {
  id: -1,
  displayName: "Air",
  name: "air",
  stackSize: 0,
};

export function getItem(id: string | number): Item {
  if (id == AIR.id) {
    return AIR;
  }

  return items[id];
}

export function equals(item: Item, item2: Item): boolean {
  return item.id === item2.id;
}

export function tileStackLeft(
  tile: Tile,
  item: Item = tile.value.item
): number {
  const { amount } = tile.value;

  return item.stackSize - amount;
}
