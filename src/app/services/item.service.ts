import { Injectable } from '@angular/core';
import items from '../../assets/data/items.json';
import {Item} from './types';
import search from 'fuzzysearch';

const itemsArray = Object.values(items);

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  static readonly AIR = items[0];

  constructor() { }

  getAll(): Item[] {
    return itemsArray;
  }

  getById(id: number | string | null): Item {
    if (id === null) {
      return null;
    }

    return items[id];
  }

  /**
   * Search for items by their display name. Case insensitive.
   */
  search(query: string): Item[] {
    const q = query.toLowerCase();
    return itemsArray.filter(({displayName}) => {
      return search(q, displayName.toLowerCase());
    });
  }
}
