import {EntiteModel} from "./entite.model";
import {FactureModel} from "./facture.model";
import {CompagniModel} from "./compagni.model";

export class PersonneModel extends EntiteModel{

  constructor(
    public prenom?: string,
    public dateNaiss?:string,
    public civilite?:string,
    public titre?:string,
    public isPrescripteur?: boolean,
    public entreprise?: CompagniModel,
    public factures?: FactureModel[],
    public id?:number,
  ) {
    super(null);
  }

}
