import craftingTable from "@/assets/gui/crafting_table.png";
import recipeBook from "@/assets/gui/recipe_book.png";

export const sprites = {
  crafting_book: {
    url: craftingTable,
    x: 0,
    y: 168,
    width: 20,
    height: 18,
  },
  crafting_book_hover: {
    url: craftingTable,
    x: 0,
    y: 187,
    width: 20,
    height: 18,
  },
  crafting_arrow: {
    url: craftingTable,
    x: 90,
    y: 35,
    width: 22,
    height: 15,
  },
  recipe_search: {
    url: recipeBook,
    x: 10,
    y: 13,
    width: 12,
    height: 12,
  },
  recipe_arrow_left: {
    url: recipeBook,
    x: 15,
    y: 208,
    width: 11,
    height: 17,
  },
  recipe_arrow_left_hover: {
    url: recipeBook,
    x: 15,
    y: 226,
    width: 11,
    height: 17,
  },
  recipe_arrow_right: {
    url: recipeBook,
    x: 1,
    y: 208,
    width: 11,
    height: 17,
  },
  recipe_arrow_right_hover: {
    url: recipeBook,
    x: 1,
    y: 226,
    width: 11,
    height: 17,
  },
  recipe_showing_all: {
    url: recipeBook,
    x: 152,
    y: 41,
    width: 26,
    height: 16,
  },
  recipe_showing_all_hover: {
    url: recipeBook,
    x: 152,
    y: 59,
    width: 26,
    height: 16,
  },
  recipe_showing_craftable: {
    url: recipeBook,
    x: 180,
    y: 41,
    width: 26,
    height: 16,
  },
  recipe_showing_craftable_hover: {
    url: recipeBook,
    x: 180,
    y: 59,
    width: 26,
    height: 16,
  },
} as const;

export type SpriteId = keyof typeof sprites;
