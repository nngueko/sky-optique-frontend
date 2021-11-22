import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
import {ProduitModel} from "../models/produit.model";
import {LentilleModel} from "../models/lentille.model";
import {BonLivraisonModel} from "../models/bonLivraison.model";

@Injectable({
  providedIn: 'root'
})
export class BonLivraisonService {

  url = 'http://localhost:8080/bonLivraison/';

  listBonLivraisons : BonLivraisonModel[];
  listBonLivraisonSubject = new Subject<BonLivraisonModel[]>();
  emitListBonLivraisonSubject(){
    this.listBonLivraisonSubject.next(this.listBonLivraisons.slice());
  }
  constructor(private httpClient: HttpClient) { }

  getAllBonLivraison() {
    return this.httpClient.get<any[]>(this.url).subscribe(
      (bonLivraisons: BonLivraisonModel[]) => {
        this.listBonLivraisons = bonLivraisons;
        this.emitListBonLivraisonSubject();
      }
    );
  }

  getBonLivraisonById(idBonLivraison : number) {
    return this.httpClient.get<any>(this.url+idBonLivraison);
  }

  addBonLivraison(bonLivraison : BonLivraisonModel) {
    return this.httpClient.post(this.url, bonLivraison);
  }

  updateBonLivraison(bonLivraison : BonLivraisonModel, idBonLivraison : number) {
    return this.httpClient.put(this.url+idBonLivraison, bonLivraison);
  }

  deleteBonLivraison(idBonLivraison : number) {
    return this.httpClient.delete(this.url+idBonLivraison);
  }

}
