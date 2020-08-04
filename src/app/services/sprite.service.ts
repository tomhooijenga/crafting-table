import { Injectable } from '@angular/core';
import sprite from '../../assets/data/sprite.json';
import {Item, Sprite} from './types';

@Injectable({
  providedIn: 'root'
})
export class SpriteService {

  constructor() { }

  getByItem(item: Item): Sprite {
    return sprite[item.id];
  }
}
