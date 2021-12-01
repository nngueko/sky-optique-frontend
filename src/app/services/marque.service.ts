import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MontureModel} from "../models/monture.model";
import {Subject} from "rxjs";
import {LentilleModel} from "../models/lentille.model";
import {MarqueModel} from "../models/marque.model";

@Injectable({
  providedIn: 'root'
})
export class MarqueService {

  url = 'http://localhost:8080/marque/';
  // @ts-ignore
  listMarques : MarqueModel[];
  listMarqueSubject = new Subject<MarqueModel[]>();
  emitListMarqueSubject(){
    this.listMarqueSubject.next(this.listMarques.slice());
  }

  constructor(private httpClient: HttpClient) { }

  getAllMarques() {
    this.httpClient.get<any[]>(this.url).subscribe(
      (data: any[]) => {
        console.log(data);
        // @ts-ignore
        this.listMarques = data._embedded.marque;
        this.emitListMarqueSubject();
      }
    );
  }

  getMarqueById(idMarque : number) {
    return this.httpClient.get<any>(this.url+idMarque);
  }

  addMarque(marque : MarqueModel) {
    return this.httpClient.post(this.url, marque);
  }

  updateMarque(marque : MarqueModel) {
    return this.httpClient.put(this.url+marque.id, marque);
  }

  deleteMarque(idMarque : number) {
    return this.httpClient.delete(this.url+idMarque);
  }

}
