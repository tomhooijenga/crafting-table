import { Component, OnInit } from '@angular/core';
import { PersonService } from '../services/person.service';

@Component({
  selector: 'app-boats',
  templateUrl: './boats.component.html',
  styleUrls: ['./boats.component.scss']
})
export class BoatsComponent implements OnInit {

  constructor(public personService: PersonService) { }

  ngOnInit(): void {
    // this.personService.getAll().subscribe((people) => this.people = people);
    // this.people = this.personService.getAll();
  }
}
