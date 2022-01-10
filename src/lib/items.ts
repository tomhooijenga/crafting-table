import _items from "@/assets/data/items.json";
import { Item, Tile } from "@/types";

export const items = _items as Record<string, Item>;

export const AIR = items[0];

export function getItem(id: string | number): Item {
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
