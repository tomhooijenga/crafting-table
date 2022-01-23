import _recipes from "@/assets/data/recipes.json";
import {
  Item,
  ItemAmount,
  CraftingRecipe,
  ShapedRecipe,
  ShapelessRecipe,
  RecipePart,
} from "@/types";
import { AIR, equals } from "@/lib/items";
import { itemHasTag } from "@/lib/tags";

export const recipes = _recipes.filter(
  ({ type }) => type === "crafting_shaped" || type === "crafting_shapeless"
) as CraftingRecipe[];

export function padNull<T>(arr: Array<T>, length: number): Array<T | null> {
  return arr.concat(new Array(length - arr.length).fill(null));
}

// Todo: Find recipes if items are mirrored.
export function getByItems(grid: ItemAmount[]): CraftingRecipe | null {
  const items = grid.map(({ item }) => item);
  const shapedItems = getShapedItems(items);
  const unshapedItems = getUnshapedItems(items);

  return (
    recipes.find((recipe) =>
      recipeEqualsItems(recipe, shapedItems, unshapedItems)
    ) ?? null
  );
}

export function hasEnoughItems(
  recipe: CraftingRecipe,
  inventory: ItemAmount[]
): boolean {
  return craftableAmount(recipe, inventory) > 0;
}

export function craftableAmount(
  recipe: CraftingRecipe,
  inventory: ItemAmount[]
): number {
  const itemAmounts = inventory.reduce<Record<string, number>>(
    (amounts, { item, amount }) => {
      amounts[item.name] = (amounts[item.name] || 0) + amount;
      return amounts;
    },
    {}
  );

  const ingredients = isShaped(recipe) ? recipe.pattern : recipe.ingredients;

  let amount = 0;

  while (true) {
    for (const ingredient of ingredients) {
      if (ingredient === null) {
        continue;
      }

      const item = inventory.find(({ item }) =>
        compareRecipeItem(ingredient, item)
      );

      if (!item) {
        return 0;
      }

      if (itemAmounts[item.item.name] === 0) {
        return amount;
      }

      itemAmounts[item.item.name]--;
    }

    amount++;
  }
}

function recipeEqualsItems(
  recipe: CraftingRecipe,
  shapedItems: (Item | null)[],
  unshapedItems: Item[]
): boolean {
  if (isShaped(recipe)) {
    return shapedRecipeEqualsItems(recipe, shapedItems);
  } else {
    return unshapedRecipeEqualsItems(recipe, unshapedItems);
  }
}

export function getShapedItems(items: Item[]): (Item | null)[] {
  let result = [...items].map((item) => (equals(item, AIR) ? null : item));

  // Remove leading empty columns
  for (let i = 0; i < 3; i++) {
    if (result[0] === null && result[3] === null && result[6] === null) {
      result = [
        result[1],
        result[2],
        null,
        result[4],
        result[5],
        null,
        result[7],
        result[8],
        null,
      ];
    } else {
      break;
    }
  }

  // Remove trailing empty rows
  for (let i = 0; i < 3; i++) {
    const length = result.length;
    if (
      result[length - 1] === null &&
      result[length - 2] === null &&
      result[length - 3] === null
    ) {
      result = result.slice(0, -3);
    } else {
      break;
    }
  }

  // Remove leading empty rows
  for (let i = 0; i < 3; i++) {
    if (result[0] === null && result[1] === null && result[2] === null) {
      result = result.slice(3);
    } else {
      break;
    }
  }

  return result;
}

function shapedRecipeEqualsItems(
  recipe: ShapedRecipe,
  items: (Item | null)[]
): boolean {
  if (items.length === 0) {
    return false;
  }

  return recipe.pattern.every((ingredient, index) => {
    const item = items[index];

    if (!item || !ingredient) {
      return item == ingredient;
    }

    return compareRecipeItem(ingredient, item);
  });
}

function getUnshapedItems(items: Item[]): Item[] {
  return items.filter((item) => item !== null && !equals(item, AIR));
}

function unshapedRecipeEqualsItems(
  recipe: ShapelessRecipe,
  items: Item[]
): boolean {
  const { ingredients } = recipe;

  if (ingredients.length !== items.length) {
    return false;
  }

  const _items = [...items];

  for (const ingredient of ingredients) {
    const foundItemIndex = _items.findIndex((item) =>
      compareRecipeItem(ingredient, item)
    );

    if (foundItemIndex === -1) {
      return false;
    }

    _items.splice(foundItemIndex, 1);
  }

  return true;
}

export function compareRecipeItem(recipeItem: RecipePart, item: Item): boolean {
  if (Array.isArray(recipeItem)) {
    return recipeItem.find((ri) => compareRecipeItem(ri, item)) !== null;
  }

  if ("item" in recipeItem) {
    return recipeItem.item === item.name;
  }

  return itemHasTag(recipeItem.tag, item.name);
}

export function isShaped(recipe: CraftingRecipe): recipe is ShapedRecipe {
  return recipe.type === "crafting_shaped";
}
