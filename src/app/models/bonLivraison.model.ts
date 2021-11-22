import {ProduitModel} from "./produit.model";
import {LivraisonModel} from "./livraison.model";
import {FournisseurModel} from "./fournisseur.model";

export class BonLivraisonModel {

  constructor(
    public reference : string,
    public dateLivraison : string,
    public fournisseur? : FournisseurModel,
    public listLivraisons? : LivraisonModel[],
    public id? : number,
  ){}

}
