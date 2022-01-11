import {VenteModel} from "./vente.model";
import {PersonneModel} from "./personne.model";
import {PrescriptionModel} from "./prescription.model";

export class FactureModel {

  constructor(
    public numero?:string,
    public patient?:PersonneModel,
    public ventes?:VenteModel[],
    public prescription?: PrescriptionModel,
    public id?:number,
  ){}

}
