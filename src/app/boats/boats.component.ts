import { Component, OnInit } from '@angular/core';
import { PersonService } from '../services/person.service';
import { BoatService } from '../services/boat.service';
import {Boat} from '../services/boats';

@Component({
  selector: 'app-boats',
  templateUrl: './boats.component.html',
  styleUrls: ['./boats.component.scss']
})
export class BoatsComponent implements OnInit {

  public uses: string[] = ['any', 'competition', 'youth'];

  public filters = {
    name: '',
    use: {
      any: true,
      competition: false,
      youth: false,
    }
  };

  public boats: Boat[] = [];

  constructor(public personService: PersonService, public boatService: BoatService) { }

  ngOnInit(): void {
    this.getBoats();
  }

  getBoats(): void {
    let filteredBoats = Object
      .entries(this.filters.use)
      .filter(([, enabled]) => enabled)
      .reduce((boats, [use]) => {
        return boats.concat(this.boatService.getByUse(this.boatService.boats, use));
    }, []);

    filteredBoats = this.boatService.getByName(filteredBoats, this.filters.name);
    filteredBoats = this.boatService.getByPermissions(filteredBoats, this.personService.people);

    this.boats = filteredBoats;

  }

  getCrews() {
    console.log(this.boatService.get(this.boats, this.personService.people));
  }
}
