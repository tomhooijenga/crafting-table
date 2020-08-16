import {Component, HostBinding, Input} from '@angular/core';
import {Item} from '../services/types';

@Component({
  selector: 'app-item-icon-tile',
  templateUrl: './item-icon-tile.component.html',
})
export class ItemIconTileComponent {
  @HostBinding() className = 'tile';

  @Input() item: Item;
  @Input() amount: number | null;
}
