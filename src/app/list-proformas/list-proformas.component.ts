import { Component, OnInit } from '@angular/core';
import {FactureClientModel} from "../models/factureClient.model";
import {Subscription} from "rxjs";
import {ProformaModel} from "../models/Proforma.model";
import {FactureClientService} from "../services/factureClient.service";
import {LentilleModel} from "../models/lentille.model";
import {ProformaService} from "../services/proforma.service";

@Component({
  selector: 'app-list-proformas',
  templateUrl: './list-proformas.component.html',
  styleUrls: ['./list-proformas.component.css']
})
export class ListProformasComponent implements OnInit {

  loading = false;
  factures: ProformaModel[];
  listFactureSubscription : Subscription;

  constructor(private proformaService : ProformaService) { }

  ngOnInit(): void {
    this.loading = true;
    this.listFactureSubscription = this.proformaService.listProformaSubject.subscribe(
      (data: ProformaModel[]) => {
        this.factures = data;
        this.loading = false;
      }
    );
    this.proformaService.getAllProformas();
  }

  ngOnDestroy(): void {
    this.listFactureSubscription.unsubscribe();
  }

  deleteFacture(id: number) {
    this.loading = true;
    this.proformaService.deleteProforma(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.proformaService.getAllProformas();
      });

    this.loading = false;
  }

}
