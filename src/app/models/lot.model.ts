import {ProduitModel} from "./produit.model";
import {LivraisonModel} from "./livraison.model";

export class LotModel {

  constructor(
    public prixVente:number,
    public qte:number,
    public produit? : ProduitModel,
    public livraisons? : LivraisonModel[],
    public id?:number
  ){}

}
