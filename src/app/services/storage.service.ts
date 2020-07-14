import { Injectable } from '@angular/core';
import {ModelConstructor, ModelInterface} from './model.interface';

type Constructor<T> = new (...args: any[]) => T;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  set<T extends ModelInterface>(model: T): void {
    const ctor = model.constructor as ModelConstructor;
    const map = this.getAllRaw(ctor);

    map[model.id] = model;

    localStorage.setItem(ctor.name, JSON.stringify(map));
  }

  get<T extends ModelInterface>(type: T, id: number): T | null {
    const ctor = type.constructor as ModelConstructor;
    const map = this.getAllRaw(ctor);
    const item = map[id];

    if (!item) {
      return null;
    }

    return Object.assign(new ctor(), item);
  }

  getAll<T>(type: Constructor<T>): T[] {
    const map = this.getAllRaw(type);

    return Object.values(map).map((item) => {
      return Object.assign(new type(), item);
    });
  }

  protected getAllRaw<T>(type: Constructor<T>): object {
    const name = type.name;
    return JSON.parse(localStorage.getItem(name)) || {};
  }
}
