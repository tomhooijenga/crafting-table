import recipes from './assets/data/recipes.json';
import items from '@/assets/data/items.json';
import {Item, ItemRecipe, ShapedRecipe, UnshapedRecipe} from './types';

export const AIR = items[0];

function padNull<T>(arr: Array<T>, length: number): Array<T> {
  return arr.concat(new Array(length - arr.length).fill(null));
}

export function getItem(id: number | null): Item {
  if (id === null) {
    return AIR;
  }
  return items[id];
}

export function equals(item: Item, item2: Item): boolean {
  if (item === null || item2 === null) {
    return item === item2;
  }

  return item.id === item2.id;
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
export function getByItems(items: Item[]): ShapedRecipe | UnshapedRecipe | null {
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

function canMake(itemRecipe: ItemRecipe, shapedItems: Item[], unshapedItems: Item[]): ShapedRecipe | UnshapedRecipe | null {
  return itemRecipe.find((recipe) => {
    if (isShaped(recipe)) {
      return canMakeShaped(recipe, shapedItems);
    } else {
      return canMakeUnshaped(recipe, unshapedItems);
    }
  }) || null;
}

function getShapedItems(items: Item[]): Item[] {
  let result = [...items].map((item) => equals(item, AIR) ? null : item);

  // Move empty columns from left to right
  for (let i = 0; i < 3; i++) {
    if (result[0] === null && result[3] === null && result[6] === null) {
      result = [
        result[1], result[2], null,
        result[4], result[5], null,
        result[7], result[8], null,
      ];
    } else {
      break;
    }
  }

  // Remove trailing empty rows
  for (let i = 0; i < 3; i++) {
    const length = result.length;
    if (result[length - 1] === null && result[length - 2] === null && result[length - 3] === null) {
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

function canMakeShaped(recipe: ShapedRecipe, items: Item[]): boolean {
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
  const {ingredients} = recipe;

  if (ingredients.length !== items.length) {
    return false;
  }

  return items.every(({id}) => ingredients.includes(id));
}

function isShaped(recipe: ShapedRecipe | UnshapedRecipe): recipe is ShapedRecipe {
  return 'inShape' in recipe;
}
