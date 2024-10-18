import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Person } from './models/person';
import { AsyncPipe, JsonPipe, NgFor } from '@angular/common';
import { Observable } from 'rxjs/internal/Observable';
import { FormsModule } from '@angular/forms';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, AsyncPipe, NgFor, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Consume-Api';
  http = inject(HttpClient);
  url = 'https://localhost:44303';
  persons$?: Observable<Person[]>;
  foundPerson$?: Observable<Person>;
  personSearchName = '';
  personAddName = '';
  personIdUpdate = Guid.EMPTY;
  personNameUpdate = '';

  ngOnInit(): void {
    this.getPersons();
  }

  getPersons() {
    this.persons$ = this.http.get<Person[]>(`${this.url}/persons`);
  }

  getPerson() {
    if (!this.personSearchName) return;
    this.foundPerson$ = this.http.get<Person>(
      `${this.url}/persons/getByName/${this.personSearchName}`
    );
  }

  addPerson() {
    const newPerson: Person = {
      id: Guid.create(),
      name: this.personAddName,
    };

    this.http.post<void>(`${this.url}/persons`, newPerson).subscribe((_) => {
      this.getPersons(), (this.personSearchName = '');
    });
  }

  getDataUpdate(person: Person) {
    console.log(person);
    this.personIdUpdate = person.id;
    this.personNameUpdate = person.name;
  }

  updateName() {
    if (!this.personNameUpdate || !this.personIdUpdate) return;

    const person: Person = {
      id: this.personIdUpdate,
      name: this.personNameUpdate,
    };

    const fullUrl = `${this.url}/persons/${this.personIdUpdate}`;

    this.http.put<Person>(fullUrl, person).subscribe((_) => {
      this.getPersons(), (this.personNameUpdate = '');
    });
  }
}
