import {ProduitModel} from "./produit.model";
import {LotModel} from "./lot.model";
import {BonLivraisonModel} from "./bonLivraison.model";

export class LivraisonModel {

  constructor(
    public prixAchat : number,
    public qte : number,
    public prixVente:number,
    public lot? : LotModel,
    public bonLivraison? : BonLivraisonModel,
    public id? : number,
    ){}

}
