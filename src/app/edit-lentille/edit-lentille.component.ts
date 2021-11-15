import { Component, OnInit } from '@angular/core';
import {MontureModel} from "../models/monture.model";
import {LentilleModel} from "../models/lentille.model";
import {MontureService} from "../services/monture.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LentilleService} from "../services/lentille.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-edit-lentille',
  templateUrl: './edit-lentille.component.html',
  styleUrls: ['./edit-lentille.component.css']
})
export class EditLentilleComponent implements OnInit {

  // @ts-ignore
  isAddMode: boolean;
  loading = false;
  // @ts-ignore
  lentille = new LentilleModel(null, null, null, null, null, null);

  constructor(private lentilleService : LentilleService, private router: Router, private route: ActivatedRoute) {
    this.lentille.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.lentille.id;

    if (!this.isAddMode) {
      this.loading = true;

      // @ts-ignore
      this.lentilleService.getLentilleById(this.lentille.id).subscribe((response) => {
          this.lentille = response;
        },(error) => {
          console.log('Erreur ! : ' + error);
        }
      );
      this.loading = false;
    }
  }

  onSubmit(form: NgForm) {
    this.lentille.libelle = typeof (<string> form.value['libelle']) === "string" ? (<string> form.value['libelle']).trim() : form.value['libelle'];
    this.lentille.type = typeof (<string> form.value['type']) === "string" ? (<string> form.value['type']).trim() : form.value['type'];
    this.lentille.sphere = typeof (<string> form.value['sphere']) === "number" ? (<number> form.value['sphere']) : form.value['sphere'];
    this.lentille.cylindre = typeof (<string> form.value['cylindre']) === "number" ? (<number> form.value['cylindre']) : form.value['cylindre'];
    this.lentille.axe = <number> form.value['axe'];
    this.lentille.addition = <number> form.value['addition'];
    this.loading = true;
    console.log(this.lentille);
    if (this.isAddMode) {
      this.addLentille();
    } else {
      this.updateLentille();
    }
  }

  private addLentille() {
    this.lentilleService.addLentille(this.lentille).subscribe(data=>{
      console.log(data);
      this.lentilleService.getAllLentilles();
      this.router.navigate(['/lentilles']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

  private updateLentille() {
    this.lentilleService.updateLentille(this.lentille).subscribe(data=>{
      console.log(data);
      this.lentilleService.getAllLentilles();
      this.router.navigate(['/lentilles']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

}
