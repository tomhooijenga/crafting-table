import { Injectable } from '@angular/core';
import sprite from '../../assets/data/sprite.json';
import {Item, Icon} from './types';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor() { }

  getByItem(item: Item): Icon {
    return sprite[item.id];
  }
}
