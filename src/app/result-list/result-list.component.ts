import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ItemRecipe, ShapedRecipe, UnshapedRecipe} from '../services/types';
import {ItemService} from '../services/item.service';
import {RecipeService} from '../services/recipe.service';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
})
export class ResultListComponent implements OnChanges {

  @Input() currentRecipe: ItemRecipe = null;

  recipesUsingResult = [];

  getRecipesUsingResult(recipe: ItemRecipe): Array<ShapedRecipe | UnshapedRecipe> {
    const itemId = recipe[0].result.id;
    const item = this.itemService.getById(itemId);

    return this.recipeService.getRecipesUsingItem(item);
  }

  constructor(
    public itemService: ItemService,
    public recipeService: RecipeService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentRecipe.currentValue) {
      this.recipesUsingResult = this.getRecipesUsingResult(changes.currentRecipe.currentValue);
    }
  }
}
