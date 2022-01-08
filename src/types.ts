import { Ref } from "vue";

export interface Item {
  id: number;
  displayName: string;
  name: string;
  stackSize: number;
}

export interface ItemAmount {
  item: Item;
  amount: number;
}

export type Icon =
  | {
      id: number;
      name: string;
      animated: true;
    }
  | {
      id: number;
      name: string;
      animated: false;
      x: number;
      y: number;
    };

type RecipeBase = {
  result: {
    count: number;
    id: number;
  };
};

export type UnshapedRecipe = {
  ingredients: number[];
} & RecipeBase;

export type ShapedRecipe = {
  inShape: (number | null)[][];
} & RecipeBase;

export type Recipe = ShapedRecipe | UnshapedRecipe;

export type ItemRecipe = Recipe[];

export type Tile = Ref<Readonly<ItemAmount>>;
