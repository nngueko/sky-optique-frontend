import { Component, OnInit } from '@angular/core';
import {LentilleModel} from "../models/lentille.model";
import {FournisseurModel} from "../models/fournisseur.model";
import {LentilleService} from "../services/lentille.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FournisseurService} from "../services/fournisseur.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-edit-fournisseur',
  templateUrl: './edit-fournisseur.component.html',
  styleUrls: ['./edit-fournisseur.component.css']
})
export class EditFournisseurComponent implements OnInit {

  isAddMode: boolean;
  loading = false;
  fournisseur = new FournisseurModel(null, null, null, null, null);

  constructor(private fournisseurService : FournisseurService, private router: Router, private route: ActivatedRoute) {
    this.fournisseur.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.fournisseur.id;

    if (!this.isAddMode) {
      this.loading = true;

      // @ts-ignore
      this.fournisseurService.getFournisseurById(this.fournisseur.id).subscribe((response) => {
          this.fournisseur = response;
        this.loading = false;
        },(error) => {
          this.loading = false;
          console.log('Erreur ! : ' + error);
        }
      );
    }
  }

  onSubmit(form: NgForm) {
    this.fournisseur.nom = typeof (<string> form.value['nom']) === "string" ? (<string> form.value['nom']).trim() : form.value['nom'];
    this.fournisseur.adresse = typeof (<string> form.value['adresse']) === "string" ? (<string> form.value['adresse']).trim() : form.value['adresse'];
    this.fournisseur.email = typeof (<string> form.value['email']) === "number" ? (<number> form.value['email']) : form.value['email'];
    this.fournisseur.tel1 = typeof (<string> form.value['tel1']) === "number" ? (<number> form.value['tel1']) : form.value['tel1'];
    this.fournisseur.tel2 = typeof (<string> form.value['tel2']) === "number" ? (<number> form.value['tel2']) : form.value['tel2'];
    this.loading = true;
    if (this.isAddMode) {
      this.addFournisseur();
    } else {
      this.updateFournisseur();
    }
  }

  private addFournisseur() {
    this.fournisseurService.addFournisseur(this.fournisseur).subscribe(data=>{
      console.log(data);
      this.fournisseurService.getAllFournisseurs();
      this.router.navigate(['/fournisseurs']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

  private updateFournisseur() {
    this.fournisseurService.updateFournisseur(this.fournisseur).subscribe(data=>{
      console.log(data);
      this.fournisseurService.getAllFournisseurs();
      this.router.navigate(['/fournisseurs']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }


}
