import {AgenceModel} from "./agence.model";

export class UtilisateurModel {

  constructor(
    public pseudo:string,
    public password:string,
    public nom:string,
    public agence?:AgenceModel,
    public id?:number,
  ){}

}
