import {Component, Input, Output, OnInit, EventEmitter, HostListener, ElementRef} from '@angular/core';
import {Item, ShapedRecipe, UnshapedRecipe} from '../services/types';
import {ItemService} from '../services/item.service';
import {RecipeService} from '../services/recipe.service';


// down: take
// up

// down
// up: place

// down: take
// up
// down
// move: smear

// down
// up: swap


@Component({
  selector: 'app-crafting-table',
  templateUrl: './crafting-table.component.html',
})
export class CraftingTableComponent implements OnInit {

  @Input() currentItem: Item | null;
  @Output() selectItem = new EventEmitter<Item | null>();

  items: Item[] = new Array(9).fill(null);

  result: { id: number, count: number } | null;

  mouseIsDown = false;

  mouseUpAfterDown = true;

  constructor(
    public itemService: ItemService,
    public recipeService: RecipeService,
  ) { }

  ngOnInit(): void {
  }

  craft(): void {
    console.time('r');
    const recipe = this.recipeService.getByItems(this.items);
    this.result = recipe?.result;
    console.timeEnd('r');
  }

  itemMousedown(index): void {
    const item = this.items[index];

    if (item) {
      // Holding an item, this is a swap on mouse up.
      if (this.currentItem) {
        this.mouseUpAfterDown = true;
      }
      // Grab item.
      else {
        this.mouseUpAfterDown = false;
        this.items[index] = null;
        this.selectItem.emit(item);
        this.craft();
      }
    }
  }

  itemMouseup(index): void {
    const {currentItem} = this;
    const item = this.items[index];

    if (this.mouseUpAfterDown) {
      // Same item, drop what you're holding.
      if (item === currentItem) {
        this.selectItem.emit(null);
      }
      // Swap with whatever is there.
      else {
        this.selectItem.emit(this.items[index]);
        this.items[index] = currentItem;
        this.craft();
      }
    }

    this.mouseUpAfterDown = true;
  }

  itemMousemove(event: MouseEvent, index): void {
    // Euclidean distance. Mousemove also triggers when for a movement of 0.
    const distance = Math.sqrt(Math.pow(event.movementX, 2) + Math.pow(event.movementY, 2));

    // MC won't allow smearing over items, but we do.
    if (this.mouseIsDown && this.currentItem && distance > 1 && this.items[index] !== this.currentItem) {
      this.items[index] = this.currentItem;
      this.mouseUpAfterDown = false;
      this.craft();
    }
  }

  resultMousedown(): void {
    const {result, currentItem} = this;

    if (result) {
      // Holding an item, this is a swap on mouse up.
      if (currentItem) {
        this.mouseUpAfterDown = true;
      }
      // Grab item.
      else {
        this.mouseUpAfterDown = false;

        const item = this.itemService.getById(result.id);
        this.selectItem.emit(item);
        this.result = null;
      }
    }
  }

  resultMouseup(): void {
    const {currentItem} = this;

    if (currentItem && this.mouseUpAfterDown) {
      this.selectItem.emit(null);

      const itemRecipe = this.recipeService.getByItem(currentItem);

      if (itemRecipe) {
        this.items = this.recipeService.getItemsForRecipe(itemRecipe[0]);
        this.result = itemRecipe[0].result;
      } else {
        this.items = new Array(9).fill(null);
        this.result = {id: currentItem.id, count: 1};
      }
    }

    this.mouseUpAfterDown = true;
  }

  @HostListener('document:mousedown')
  mousedown(): void {
    this.mouseIsDown = true;
  }

  @HostListener('document:mouseup')
  mouseup(): void {
    this.mouseIsDown = false;
  }
}
