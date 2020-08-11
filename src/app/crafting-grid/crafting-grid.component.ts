import {Component, Input} from '@angular/core';
import {Item} from '../services/types';
import {ItemService} from '../services/item.service';
import {RecipeService} from '../services/recipe.service';

@Component({
  selector: 'app-crafting-grid',
  templateUrl: './crafting-grid.component.html',
})
export class CraftingGridComponent {
  @Input() items: Item[];
  @Input() result: { id: number, count: number };

  constructor(
    public itemService: ItemService,
    public recipeService: RecipeService,
  ) { }
}
