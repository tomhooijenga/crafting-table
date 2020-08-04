import {Component, Input} from '@angular/core';
import {Item} from '../services/types';

@Component({
  selector: 'app-item-icon-tile',
  templateUrl: './item-icon-tile.component.html',
})
export class ItemIconTileComponent {
  @Input() item: Item;
  @Input() amount: number | null;
}
