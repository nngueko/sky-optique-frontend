import {ProduitModel} from "./produit.model";

export class LentilleModel extends ProduitModel{

  constructor(
    //public libelle:string,
    public type:string,
    public sphere:number,
    public cylindre:number,
    public axe?:number,
    public addition?:number,
    public id?:number
  ){
    super(null, null);
  }

}
