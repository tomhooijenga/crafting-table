import _recipes from "@/assets/data/recipes.json";
import {
  Item,
  ItemAmount,
  ItemRecipe,
  Recipe,
  ShapedRecipe,
  UnshapedRecipe,
} from "@/types";
import { AIR, equals } from "@/lib/items";

export const recipes = _recipes as Record<string, ItemRecipe>;

export function padNull<T>(arr: Array<T>, length: number): Array<T> {
  return arr.concat(new Array(length - arr.length).fill(null));
}

// Todo: Find recipes if items are mirrored.
export function getByItems(grid: ItemAmount[]): Recipe | null {
  const items = grid.map(({ item }) => item);
  const shapedItems = getShapedItems(items);
  const unshapedItems = getUnshapedItems(items);

  for (const itemRecipe of Object.values(recipes)) {
    const foundRecipe = recipeEqualsItems(
      itemRecipe,
      shapedItems,
      unshapedItems
    );

    if (foundRecipe) {
      return foundRecipe;
    }
  }
  return null;
}

export function hasEnoughItems(
  recipe: Recipe,
  inventory: ItemAmount[]
): boolean {
  return craftableAmount(recipe, inventory) > 0;
}

export function craftableAmount(
  recipe: Recipe,
  inventory: ItemAmount[]
): number {
  const itemAmounts = inventory.reduce<Record<string, number>>(
    (amounts, { item, amount }) => {
      amounts[item.id] = (amounts[item.id] || 0) + amount;
      return amounts;
    },
    {}
  );

  const ingredients = isShaped(recipe)
    ? recipe.inShape.flat().filter((id): id is number => id !== null)
    : recipe.ingredients;

  const ingredientAmounts = ingredients.reduce<Record<string, number>>(
    (amounts, itemId) => {
      amounts[itemId] = (amounts[itemId] || 0) + 1;
      return amounts;
    },
    {}
  );

  return Object.entries(ingredientAmounts).reduce((min, [itemId, amount]) => {
    if (!(itemId in itemAmounts)) {
      return 0;
    }

    return Math.min(min, itemAmounts[itemId] / amount);
  }, Infinity);
}

function recipeEqualsItems(
  itemRecipe: ItemRecipe,
  shapedItems: (Item | null)[],
  unshapedItems: Item[]
): Recipe | null {
  return (
    itemRecipe.find((recipe) => {
      if (isShaped(recipe)) {
        return shapedRecipeEqualsItems(recipe, shapedItems);
      } else {
        return unshapedRecipeEqualsItems(recipe, unshapedItems);
      }
    }) || null
  );
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
  // Recipes are stored upside down
  const inShape = [...recipe.inShape]
    .reverse()
    .map((row) => padNull(row, 3))
    .flat();

  if (inShape.length !== items.length) {
    return false;
  }

  return items.every((item, index) => {
    if (item === null) {
      return inShape[index] === null;
    }

    return inShape[index] === item.id;
  });
}

function getUnshapedItems(items: Item[]): Item[] {
  return items.filter((item) => item !== null && !equals(item, AIR));
}

function unshapedRecipeEqualsItems(
  recipe: UnshapedRecipe,
  items: Item[]
): boolean {
  const { ingredients } = recipe;

  if (ingredients.length !== items.length) {
    return false;
  }

  const itemIds = new Set(items.map(({ id }) => id));
  return ingredients.every((id) => itemIds.has(id));
}

export function isShaped(recipe: Recipe): recipe is ShapedRecipe {
  return "inShape" in recipe;
}
