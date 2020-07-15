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
    // this.personService.getAll().subscribe((people) => this.people = people);
    // this.people = this.personService.getAll();
    // this.boats = this.boatService.boats;
    this.getBoats();
  }

  getBoats(): void {
    const filteredBoats = Object
      .entries(this.filters.use)
      .filter(([, enabled]) => enabled)
      .reduce((boats, [use]) => {
        return boats.concat(this.boatService.getByUse(use));
    }, []);

    this.boats = filteredBoats.filter(({name}) => name.toLowerCase().includes(this.filters.name.toLowerCase()));
  }
}
