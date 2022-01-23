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
    item: string;
  };
};

export type RecipeItem = {
  item: string;
};

export type RecipeTag = {
  tag: string;
};

export type RecipePart = RecipeItem | RecipeTag | (RecipeItem | RecipeTag)[];

export type ShapelessRecipe = {
  type: "crafting_shapeless";
  group: string;
  ingredients: (RecipeItem | RecipeTag)[];
} & RecipeBase;

export type ShapedRecipe = {
  type: "crafting_shaped";
  group: string;
  pattern: (RecipePart | null)[];
} & RecipeBase;

export type CraftingRecipe = ShapedRecipe | ShapelessRecipe;

export type Tile = Ref<Readonly<ItemAmount>>;
