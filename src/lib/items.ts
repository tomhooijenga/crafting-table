import _items from "@/assets/data/items.json";
import { Item, RecipePart, Tile } from "@/types";
import { getTagItems } from "@/lib/tags";

export const items = _items as Record<string, Item>;

export const AIR: Readonly<Item> = items.air;

export function getItem(name: string | number): Item {
  if (name == AIR.name) {
    return AIR;
  }

  return items[name];
}

export function getRecipeItems(ingredient: RecipePart): Item[] {
  if (Array.isArray(ingredient)) {
    return ingredient.flatMap(getRecipeItems);
  }

  if ("item" in ingredient) {
    return [getItem(ingredient.item)];
  }

  return getTagItems(ingredient.tag).map(getItem);
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
