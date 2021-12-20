import {LentilleModel} from "./lentille.model";
import {PrescripteurModel} from "./prescripteur.model";

export class PrescriptionModel {

  constructor(
    datePrescription: Date,
    deadline: Date,
    eyeVision: String,
    port: String,
    lentille: LentilleModel,
    Prescripteur: PrescripteurModel,
    public id?:number
  ){}

}
