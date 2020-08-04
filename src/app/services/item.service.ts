import { Injectable } from '@angular/core';
import items from '../../assets/data/items.json';
import sprite from '../../assets/data/sprite.json';
import {Item, Section} from './types';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor() { }

  getAll(): Item[] {
    return Object.values(items);
  }

  getBySection(section: Section): Item[] {
    return section.items.map((id) => this.getById(id));
  }

  getById(id: number | string | null): Item {
    if (id === null) {
      return null;
    }

    return items[id];
  }

  getSprite(item: Item): string {
    const {x, y} = sprite[item.id] || {x: 0, y: 0};

    return `-${x}px -${y}px`;
  }
}
