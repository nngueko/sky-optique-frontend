import {ReglementModel} from "./reglement.model";
import {VenteModel} from "./vente.model";
import {CouvertureModel} from "./couverture.model";
import {PersonneModel} from "./personne.model";
import {PrescriptionModel} from "./prescription.model";

export class FactureModel {

  constructor(
    public patient?:PersonneModel,
    public ventes?:VenteModel[],
    public couvertures?:CouvertureModel[],
    public prescription?: PrescriptionModel,
    public reglements?:ReglementModel[],
    public id?:number,
  ){}

}
