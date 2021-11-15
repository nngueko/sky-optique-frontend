import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {MontureModel} from "../models/monture.model";
import {MontureService} from "../services/monture.service";

@Component({
  selector: 'app-list-montures',
  templateUrl: './list-montures.component.html',
  styleUrls: ['./list-montures.component.css']
})
export class ListMonturesComponent implements OnInit {

  loading = false;
  // @ts-ignore
  montures: MontureModel[];
  // @ts-ignore
  listMontureSubscription : Subscription;
  constructor(private montureService : MontureService) { }

  ngOnInit(): void {
    this.loading = true;
    this.listMontureSubscription = this.montureService.listMontureSubject.subscribe(
      (montures: MontureModel[]) => {
        this.montures = montures
      }
    );
    this.montureService.getAllMontures();
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.listMontureSubscription.unsubscribe();
  }

  deleteMonture(id: number) {
    this.loading = true;
    this.montureService.deleteMonture(id)
      .subscribe( data =>{
        console.log("ok deleting");
        this.montureService.getAllMontures();
      });

    this.loading = false;
  }

}
