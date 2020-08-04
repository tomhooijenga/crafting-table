export interface Item {
  id: number;
  displayName: string;
  name: string;
  stackSize: number;
}

export interface Section {
  id: number;
  name: string;
  items: number[];
}

export interface ItemRecipe extends Array<UnshapedRecipe | ShapedRecipe> {}

interface Recipe {
  result: {
    count: number,
    id: number,
  };
}

export interface UnshapedRecipe extends Recipe {
  ingredients: Array<number | null>;
}
export interface ShapedRecipe extends Recipe {
  inShape: Array<number | null>[];
}
