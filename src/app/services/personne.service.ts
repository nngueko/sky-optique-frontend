import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {PersonneModel} from "../models/personne.model";

@Injectable({
  providedIn: 'root'
})
export class PersonneService {

  url = 'http://localhost:8080/personne/';
  // @ts-ignore
  listPersonnes : PersonneModel[];
  listPersonneSubject = new Subject<PersonneModel[]>();
  emitlistPersonneSubject(){
    this.listPersonneSubject.next(this.listPersonnes.slice());
  }

  listPatients : PersonneModel[];
  listPatientSubject = new Subject<PersonneModel[]>();
  emitlistPatientSubject(){
    this.listPatientSubject.next(this.listPatients.slice());
  }

  constructor(private httpClient: HttpClient) { }

  getAllPersonnes() {
    this.httpClient.get<any[]>(this.url).subscribe(
      (data: any[]) => {
        console.log(data);
        // @ts-ignore
        this.listPersonnes = data._embedded.personne;
        this.emitlistPersonneSubject();
      }
    );
  }

  getAllPatients() {
    this.httpClient.get<any[]>(this.url).subscribe(
      (data: any[]) => {
        console.log(data);
        // @ts-ignore
        this.listPatients = data._embedded.personne;
        this.emitlistPatientSubject();
      }
    );
  }

  getPersonneById(idPersonne : number) {
    return this.httpClient.get<any>(this.url+idPersonne);
  }

  addPersonne(personne : PersonneModel) {
    return this.httpClient.post(this.url, personne);
  }

  updatePersonne(personne : PersonneModel) {
    return this.httpClient.put(this.url+personne.id, personne);
  }

  deleteLentille(idPersonne : number) {
    return this.httpClient.delete(this.url+idPersonne);
  }

}
