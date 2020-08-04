import { Injectable } from '@angular/core';
import recipes from '../../assets/data/recipes.json';
import {Item, ItemRecipe, ShapedRecipe, UnshapedRecipe} from './types';
import {ItemService} from './item.service';

function padNull<T>(arr: Array<T>, length: number): Array<T> {
  return arr.concat(new Array(length - arr.length).fill(null));
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(protected itemService: ItemService) { }

  getByItem(item: Item): ItemRecipe {
    return recipes[item.id];
  }

  getItemsForRecipe(recipe: ShapedRecipe | UnshapedRecipe): Item[] {
    if (this.isShaped(recipe)) {
      return padNull([...recipe.inShape].reverse(), 3)
        .map((row) => {
          if (row === null) {
            return padNull([], 3);
          }
          return padNull(row, 3);
        })
        .flat()
        .map((id) => this.itemService.getById(id));
    } else {
      return padNull(recipe.ingredients, 9)
        .map((id) => this.itemService.getById(id));
    }
  }

  getByItems(items: Item[]): ShapedRecipe | UnshapedRecipe | null {
    for (const itemRecipe of Object.values(recipes)) {
      const unshapedItems = this.getUnshapedItems(items);
      const shapedItems = this.getShapedItems(items);
      const foundRecipe = this.canMake(itemRecipe, shapedItems, unshapedItems);

      if (foundRecipe) {
        return foundRecipe;
      }
    }
    return null;
  }

  canMake(itemRecipe: ItemRecipe, shapedItems: Item[], unshapedItems: Item[]): ShapedRecipe | UnshapedRecipe | null {
    return itemRecipe.find((recipe) => {
      if (this.isShaped(recipe)) {
        return this.canMakeShaped(recipe, shapedItems);
      } else {
        return this.canMakeUnshaped(recipe, unshapedItems);
      }
    });
  }

  protected getShapedItems(items: Item[]): Item[] {
    let result = [...items];

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

  protected canMakeShaped(recipe: ShapedRecipe, items: Item[]): boolean {
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

  protected getUnshapedItems(items: Item[]): Item[] {
    return items.filter((item) => item !== null);
  }

  protected canMakeUnshaped(recipe: UnshapedRecipe, items: Item[]): boolean {
    const {ingredients} = recipe;

    if (ingredients.length !== items.length) {
      return false;
    }

    return items.every(({id}) => ingredients.includes(id));
  }

  isShaped(recipe: ShapedRecipe | UnshapedRecipe): recipe is ShapedRecipe {
    return (recipe as ShapedRecipe).inShape !== undefined;
  }
}
