import _recipes from "../assets/data/recipes.json";
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

//
// function getItemsForRecipe(recipe: ShapedRecipe | UnshapedRecipe): Item[] {
//   if (isShaped(recipe)) {
//     return padNull([...recipe.inShape].reverse(), 3)
//       .map((row) => {
//         if (row === null) {
//           return padNull([], 3);
//         }
//         return padNull(row, 3);
//       })
//       .flat()
//       .map((id) => getItem(id));
//   } else {
//     return padNull(recipe.ingredients, 9)
//       .map((id) => getItem(id));
//   }
// }
//

// Todo: Find recipes if items are mirrored.
export function getByItems(grid: ItemAmount[]): Recipe | null {
  const items = grid.map(({ item }) => item);
  const shapedItems = getShapedItems(items);
  const unshapedItems = getUnshapedItems(items);

  for (const itemRecipe of Object.values(recipes)) {
    const foundRecipe = canMake(itemRecipe, shapedItems, unshapedItems);

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
  const itemAmounts = inventory.reduce<Record<number, number>>(
    (amounts, { item, amount }) => {
      amounts[item.id] = (amounts[item.id] || 0) + amount;
      return amounts;
    },
    {}
  );

  const ingredients = isShaped(recipe)
    ? recipe.inShape.flat().filter((id): id is number => id !== null)
    : recipe.ingredients;

  for (const ingredient of ingredients) {
    if (ingredient in itemAmounts) {
      if (itemAmounts[ingredient] === 0) {
        return false;
      }

      itemAmounts[ingredient]--;
    } else {
      return false;
    }
  }
  return true;
}
//
// function getRecipesUsingItem(item: Item): Array<ShapedRecipe | UnshapedRecipe> {
//   return Object
//     .values(recipes)
//     .map((itemRecipe: ItemRecipe) => {
//       return itemRecipe.filter((recipe) => {
//         return getItemsForRecipe(recipe).includes(item);
//       });
//     }).flat();
// }

function canMake(
  itemRecipe: ItemRecipe,
  shapedItems: (Item | null)[],
  unshapedItems: Item[]
): Recipe | null {
  return (
    itemRecipe.find((recipe) => {
      if (isShaped(recipe)) {
        return canMakeShaped(recipe, shapedItems);
      } else {
        return canMakeUnshaped(recipe, unshapedItems);
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

function canMakeShaped(recipe: ShapedRecipe, items: (Item | null)[]): boolean {
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

function canMakeUnshaped(recipe: UnshapedRecipe, items: Item[]): boolean {
  const { ingredients } = recipe;

  if (ingredients.length !== items.length) {
    return false;
  }

  return items.every(({ id }) => ingredients.includes(id));
}

export function isShaped(recipe: Recipe): recipe is ShapedRecipe {
  return "inShape" in recipe;
}
