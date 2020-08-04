import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../services/types';
import {ItemService} from '../services/item.service';

@Component({
  selector: 'app-item-icon',
  templateUrl: './item-icon.component.html',
})
export class ItemIconComponent implements OnInit {

  private _item: Item;

  @Input()
  set item(item: Item | null) {
    this._item = item ? item : this.itemService.getById(0);
  }

  get item(): Item {
    return this._item;
  }

  constructor(public itemService: ItemService) {
  }

  ngOnInit(): void {
    // console.log(this.item);
  }

  bgPosition(): string {
    return this.itemService.getSprite(this.item);
  }
}
