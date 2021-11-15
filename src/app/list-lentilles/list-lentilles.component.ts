import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {LentilleModel} from "../models/lentille.model";
import {MontureService} from "../services/monture.service";
import {LentilleService} from "../services/lentille.service";
import {MontureModel} from "../models/monture.model";

@Component({
  selector: 'app-list-lentilles',
  templateUrl: './list-lentilles.component.html',
  styleUrls: ['./list-lentilles.component.css']
})
export class ListLentillesComponent implements OnInit {

  loading = false;
  // @ts-ignore
  lentilles: LentilleModel[];
  // @ts-ignore
  listLentilleSubscription : Subscription;

  constructor(private lentilleService : LentilleService) { }

  ngOnInit(): void {
    this.loading = true;
    this.listLentilleSubscription = this.lentilleService.listLentilleSubject.subscribe(
      (lentilles: LentilleModel[]) => {
        this.lentilles = lentilles
      }
    );
    this.lentilleService.getAllLentilles();
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.listLentilleSubscription.unsubscribe();
  }

  deleteLentille(id: number) {
    this.loading = true;
    this.lentilleService.deleteLentille(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.lentilleService.getAllLentilles();
      });

    this.loading = false;
  }

}
