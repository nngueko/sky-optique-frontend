import {ProduitModel} from "./produit.model";

export class MontureModel extends ProduitModel{

  constructor(
    public reference:string,
    //public nomComplet:string,
    public model:string,
    public matiere:string,
    public genre:string,
    public taille:string,
    public id?:number
  ) {
    super(null, null);
  }

}
