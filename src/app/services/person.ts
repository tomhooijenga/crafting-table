import {ModelConstructor, ModelInterface} from './model.interface';

export class Person implements ModelInterface {
  public name: string;

  constructor(public id?: number) {
  }
}
