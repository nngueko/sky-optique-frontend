export class LivraisonModel {

  constructor(public prixAchat:string,
              public qte:string,
              public date:string,
              public idProduit:number,
              public idLot:number,
              public idBonLivraison?:number,
              public idCommande?:number,
              public id?:number,
            ){}

}
