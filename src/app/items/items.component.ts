import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {ItemService} from '../services/item.service';
import {Item} from '../services/types';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
})
export class ItemsComponent implements OnInit {
  @HostBinding() className = 'panel grid grid--results';

  @Input() currentItem: Item;
  @Output() selectItem = new EventEmitter<Item>();

  mouseUpAfterDown = true;

  items: Item[];

  constructor(
    public itemService: ItemService
  ) { }

  ngOnInit(): void {
    this.items = this.itemService.getAll();
  }

  mousedown(item: Item): void {
    if (this.currentItem) {
      this.mouseUpAfterDown = true;
    }
    // Grab item.
    else {
      this.mouseUpAfterDown = false;
      this.selectItem.emit(item);
    }
  }

  mouseup(item: Item): void {
    const {currentItem} = this;

    if (this.mouseUpAfterDown) {
      // Same item, drop what you're holding.
      if (item === currentItem) {
        this.selectItem.emit(null);
      }
      // Swap with whatever is there.
      else {
        this.selectItem.emit(item);
      }
    }

    this.mouseUpAfterDown = true;
  }

  search(event: InputEvent): void {
    const {value} = event.target as HTMLInputElement;
console.log(value);
    this.items = this.itemService.search(value);
  }
}
