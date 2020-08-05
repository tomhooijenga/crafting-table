import {Component, Input} from '@angular/core';
import {Item} from '../services/types';
import {ItemService} from '../services/item.service';
import {IconService} from '../services/icon.service';

@Component({
  selector: 'app-item-icon',
  templateUrl: './item-icon.component.html',
})
export class ItemIconComponent {

  private _item: Item = this.itemService.getById(0);

  @Input()
  set item(item: Item | null) {
    this._item = item ? item : this.itemService.getById(0);
  }

  get item(): Item {
    return this._item;
  }

  constructor(public itemService: ItemService, public iconService: IconService) {
  }

  animated(): boolean {
    const sprite = this.iconService.getByItem(this._item);
    return sprite.animated;
  }

  src(): string {
    const sprite = this.iconService.getByItem(this._item);
    return sprite.name;
  }

  position(): string {
    const {x, y} = this.iconService.getByItem(this._item);
    return `-${x}px -${y}px`;
  }
}
