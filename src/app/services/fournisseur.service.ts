import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MontureModel} from "../models/monture.model";
import {Subject} from "rxjs";
import {LentilleModel} from "../models/lentille.model";
import {FournisseurModel} from "../models/fournisseur.model";

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  url = 'http://localhost:8080/fournisseur/';
  // @ts-ignore
  listFournisseurs : FournisseurModel[];
  listFournisseurSubject = new Subject<FournisseurModel[]>();
  emitListFournisseurSubject(){
    this.listFournisseurSubject.next(this.listFournisseurs);
  }

  constructor(private httpClient: HttpClient) { }

  getAllFournisseurs() {
    this.httpClient.get<any[]>(this.url).subscribe(
      (data: any[]) => {
        // @ts-ignore
        this.listFournisseurs = data._embedded.fournisseur;
        this.emitListFournisseurSubject();
      }
    );
  }

  getFournisseurById(idFournisseur : number) {
    return this.httpClient.get<any>(this.url+idFournisseur);
  }

  getFournisseurByIdBonLivraison(idBonLivraison : number) {
    return this.httpClient.get<any>("http://localhost:8080/bonLivraison/"+idBonLivraison+"/fournisseur");
  }

  addFournisseur(fournisseur : FournisseurModel) {
    return this.httpClient.post(this.url, fournisseur);
  }

  updateFournisseur(fournisseur : FournisseurModel) {
    return this.httpClient.put(this.url+fournisseur.id, fournisseur);
  }

  deleteFournisseur(idFournisseur : number) {
    return this.httpClient.delete(this.url+idFournisseur);
  }

}
