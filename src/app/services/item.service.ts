import { Injectable } from '@angular/core';
import items from '../../assets/data/items.json';
import sprite from '../../assets/data/sprite.json';
import {Item} from './types';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor() { }

  getAll(): Item[] {
    return Object.values(items);
  }

  getById(id: number | string | null): Item {
    if (id === null) {
      return null;
    }

    return items[id];
  }
}
