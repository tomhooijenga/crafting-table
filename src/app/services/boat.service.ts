import {Injectable} from '@angular/core';
import {boats, Boat} from './boats';
import {Person} from './person';

@Injectable({
  providedIn: 'root'
})
export class BoatService {

  boats: Boat[] = boats;

  getByUse(boats: Boat[], type: string): Boat[] {
    return boats.filter((boat) => boat.use === type);
  }

  getByName(boats: Boat[], name: string): Boat[] {
    return boats.filter((boat) => boat.name.toLowerCase().includes(name.toLowerCase()));
  }

  getByPermissions(boats: Boat[], crew: Person[]): Boat[] {
    const permissions = crew.reduce((permissions: { steer: number, scull: number, sweep: number }, person) => {
      return {
        steer: Math.max(permissions.steer, person.steer),
        scull: Math.max(permissions.scull, person.scull),
        sweep: Math.max(permissions.sweep, person.sweep),
      };
    }, {steer: 0, scull: 0, sweep: 0});

    return boats.filter((boat) => {
      return boat.permissions.steer <= permissions.steer
        && boat.permissions.scull <= permissions.scull
        && boat.permissions.sweep <= permissions.sweep;
    });
  }

  // def f(v, i, S):
  //   if i >= len(v): return 1 if S == 0 else 0
  //   count = f(v, i + 1, S)
  //   count += f(v, i + 1, S - v[i])
  //   return count
  get(boats: Boat[], people: Person[]): number {

    function sums(v, i, S, memo = {}): number {
      if (i > v.length) {
        return S === 0 ? 1 : 0;
      }

      const key = `${i},${S}`;
      if (!memo[key]) {
        const count = sums(v, i + 1, S, memo) + sums(v, i + 1, S - v[i], memo);
        memo[key] = count;
        return count;
      }

      return memo[key];
    }

    const seats = boats.map(({users}) => users);

    return sums(seats, 0, people.length);
  }
}
