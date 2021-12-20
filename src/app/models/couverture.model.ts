import {FactureModel} from "./facture.model";
import {PersonneModel} from "./personne.model";
import {CompagniModel} from "./compagni.model";

export class CouvertureModel {

  constructor(

    public couvertureVerre: string,
    public couvertureMonture: string,
    public dateDocument: string,
    public numeroDocument: string,
    public priseEnCharge: string,
    public franchise: string,
    public facture?: FactureModel,
    public assurance?: CompagniModel,
    public entreprise?: CompagniModel,
    public assurePrincipal?: PersonneModel,
    public relation?: string,
    public id?:number,

  ){}

}
