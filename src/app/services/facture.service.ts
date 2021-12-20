import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MontureModel} from "../models/monture.model";
import {Subject} from "rxjs";
import {LentilleModel} from "../models/lentille.model";
import {FactureModel} from "../models/facture.model";

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  url = 'http://localhost:8080/facture/';
  url2 = 'http://localhost:8080/factureCtr/';
  // @ts-ignore
  listFactures : FactureModel[];
  listFactureSubject = new Subject<FactureModel[]>();
  emitlistFacrureSubject(){
    this.listFactureSubject.next(this.listFactures);
  }

  constructor(private httpClient: HttpClient) { }

  getAllFactures() {
    this.httpClient.get<any[]>(this.url).subscribe(
      (data: any[]) => {
        console.log(data);
        // @ts-ignore
        this.listFactures = data._embedded.lentille;
        this.emitlistFacrureSubject();
      }
    );
  }

  getFactureById(idFacture : number) {
    return this.httpClient.get<any>(this.url+idFacture);
  }

  addFacture(facture : FactureModel) {
    return this.httpClient.post(this.url2, facture);
  }

  updateFacture(facture : FactureModel) {
    return this.httpClient.put(this.url+facture.id, facture);
  }

  deleteFacture(idFacture : number) {
    return this.httpClient.delete(this.url+idFacture);
  }

}
