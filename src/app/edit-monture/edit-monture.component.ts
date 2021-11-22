import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MontureModel} from "../models/monture.model";
import {MontureService} from "../services/monture.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-edit-monture',
  templateUrl: './edit-monture.component.html',
  styleUrls: ['./edit-monture.component.css']
})
export class EditMontureComponent implements OnInit {

  // @ts-ignore
  isAddMode: boolean;
  loading = false;
  // @ts-ignore
  monture = new MontureModel(null, null, null, null, null, null, null);

  constructor(private montureService : MontureService, private router: Router, private route: ActivatedRoute) {
    this.monture.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.monture.id;

    if (!this.isAddMode) {
      this.loading = true;

      // @ts-ignore
      this.montureService.getMontureById(this.monture.id).subscribe((response) => {
        this.monture = response;
      },(error) => {
        console.log('Erreur ! : ' + error);
        }
      );
      this.loading = false;
    }
  }


  onSubmit(form: NgForm) {
    this.monture.reference = typeof (<string> form.value['monture_ref']) === "string" ? (<string> form.value['monture_ref']).trim() : form.value['monture_ref'];
    this.monture.libelle = typeof (<string> form.value['libelle']) === "string" ? (<string> form.value['libelle']).trim() : form.value['libelle'];
    this.monture.model = typeof (<string> form.value['monture_model']) === "string" ? (<string> form.value['monture_model']).trim() : form.value['monture_model'];
    this.monture.matiere = typeof (<string> form.value['monture_matiere']) === "string" ? (<string> form.value['monture_matiere']).trim() : form.value['monture_matiere'];
    this.monture.genre = typeof (<string> form.value['monture_genre']) === "string" ? (<string> form.value['monture_genre']).trim() : form.value['monture_genre'];
    this.monture.taille = typeof (<string> form.value['monture_taille']) === "string" ? (<string> form.value['monture_taille']).trim() : form.value['monture_taille'];
    console.log(this.monture);
    this.loading = true;
    if (this.isAddMode) {
      this.addMonture();
    } else {
      this.updateMonture();
    }
  }

  private addMonture() {
    this.montureService.addMonture(this.monture).subscribe(data=>{
      console.log(data);
      this.montureService.getAllMontures();
      this.router.navigate(['/montures']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

  private updateMonture() {
    this.montureService.updateMonture(this.monture).subscribe(data=>{
      console.log(data);
      this.montureService.getAllMontures();
      this.router.navigate(['/montures']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }


}
