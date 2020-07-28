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
  // def g(v, S, memo):
  //   subset = []
  //   for i, x in enumerate(v):
  //   # Check if there is still a solution if we include v[i]
  //   if f(v, i + 1, S - x, memo) > 0:
  //     subset.append(x)
  //   S -= x
  //   return subset
  get(boats: Boat[], people: Person[]): number {
    function* powerset(l) {
      yield* (function* ps(list) {
        if (list.length === 0) {
          return [[]];
        }
        const head = list.pop();
        const tailPS = ps(list);
        yield tailPS.concat(tailPS.map(function (e) {
          return [head].concat(e);
        }));
      })(l.slice());
    }

    function sum(nums) {
      return nums.reduce((total, num) => total + num, 0);
    }

    const seats = boats.map(({users}) => users);
    const cache = new Set<string>();
    const combinations = [];

    const memo = new Map();

    for (const combination of allCombinations(seats)) {
      const key = combination.sort().join(',');
      memo.set(key, sum(combination));

      if (cache.has(key)) {
        continue;
      }

      if (sum(combination) === people.length) {
        cache.add(key);
        combinations.push(combination);
      }
    }

    console.log(combinations);
    return 2;
  }
}
