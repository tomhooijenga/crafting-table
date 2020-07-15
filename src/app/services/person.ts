import {ModelConstructor, ModelInterface} from './model.interface';

export class Person implements ModelInterface {
  public name: string;

  public steer = 0;

  public scull = 0;

  public sweep = 0;

  constructor(public id?: number) {
  }
}
