import { Injectable } from '@angular/core';
import { Person } from './person';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  people: Person[];

  constructor(private storage: StorageService) {
    this.people = this.storage.getAll(Person);
  }

  create(): void {
    const p = new Person();
    p.id = Date.now();
    p.name = 'Person';
    this.storage.set(p);
    this.people.push(p);
  }

  save(person: Person): void {
    this.storage.set(person);
  }

  delete(person: Person): void {
    this.storage.delete(person);
    this.people.splice(this.people.indexOf(person), 1);
  }
}
