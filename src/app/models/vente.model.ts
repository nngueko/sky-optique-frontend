import {ProduitModel} from "./produit.model";
import {FactureModel} from "./facture.model";

export class VenteModel {

  constructor(
    public pu:number,
    public qte:number,
    public montant:number,
    public remise:number,
    public total:number,
    public tva?:number,
    public produit?: ProduitModel,
    public facture?: FactureModel,
    public id?:number,
  ){}

}
