import { Injectable } from '@angular/core';
import {boats, Boat} from './boats';

@Injectable({
  providedIn: 'root'
})
export class BoatService {

  boats: Boat[] = boats;

  getByUse(type: string): Boat[] {
    return this.boats.filter((boat) => boat.use === type);
  }

  // def f(v, i, S):
  //   if i >= len(v): return 1 if S == 0 else 0
  //   count = f(v, i + 1, S)
  //   count += f(v, i + 1, S - v[i])
  //   return count
  // get(people: Person[]): Boat[][] {
  //
  //   function sums(v, i, S, memo = {}) {
  //     if (i > v.length) {
  //       return S === 0 ? 1 : 0;
  //     }
  //
  //     const key = `${i},${S}`;
  //     if (!memo[key]) {
  //       const count = sums(v, i + 1, S, memo) + sums(v, i + 1, S - v[i], memo);
  //       memo[key] = count;
  //       return count;
  //     }
  //
  //     return memo[key];
  //   }
  //
  //
  //   return sums(boats, 0, people.length);
  // }
}
