import {ProduitModel} from "./produit.model";

export class LotModel {

  constructor(
    public nom:string,
    public prixVente:number,
    public qte:number,
    public produit : ProduitModel,
    public id?:number
  ){}

}
