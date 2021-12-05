import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MontureModel} from "../models/monture.model";
import {MontureService} from "../services/monture.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-monture',
  templateUrl: './edit-monture.component.html',
  styleUrls: ['./edit-monture.component.css']
})
export class EditMontureComponent implements OnInit {

  isAddMode: boolean;
  montureForm: FormGroup;
  submitted = false;
  loading = false;
  monture = new MontureModel(null, null, null, null, null, null, null);

  constructor(private formBuilder: FormBuilder, private montureService : MontureService, private router: Router, private route: ActivatedRoute) {
    this.monture.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.monture.id;
    this.initForm(this.monture);
    if (!this.isAddMode) {
      this.loading = true;
      this.montureService.getMontureById(this.monture.id).subscribe((response) => {
        this.monture = response;
        this.initForm(this.monture);
      },(error) => {
        console.log('Erreur ! : ' + error);
        }
      );
      this.loading = false;
    }

  }

  initForm(monture : MontureModel){
    this.montureForm = this.formBuilder.group({
      reference: [monture.reference, Validators.compose([Validators.required])],
      libelle: [monture.libelle, Validators.compose([Validators.required])],
      modele: monture.modele,
      matiere: monture.matiere,
      genre: monture.genre,
      taille: monture.taille,
      forme: monture.forme,
    });
  }

  get f() { return this.montureForm.controls; }

  onSubmitForm() {
    this.submitted = true;
    if (this.montureForm.invalid) {
      return;
    }
    const formValue = this.montureForm.value;
    let editedMonture : MontureModel = new MontureModel(
      formValue['reference'] ? ( <string>formValue['reference']).trim() : formValue['reference'],
      formValue['modele'] ? (<string> formValue['modele']).trim() : formValue['modele'],
      formValue['matiere'] ? (<string> formValue['matiere']).trim() : formValue['matiere'],
      formValue['genre'] ? (<string> formValue['genre']).trim() : formValue['genre'],
      formValue['taille'] ? (<string> formValue['taille']).trim() : formValue['taille'],
      formValue['forme'] ? (<string> formValue['forme']).trim() : formValue['forme']
    );
    editedMonture.libelle = (<string> formValue['libelle']).trim();
    console.log(editedMonture);

    if (this.isAddMode) {
      this.addMonture(editedMonture);
    } else {
      this.updateMonture(editedMonture);
    }

  }

  onReset() {
    this.submitted = false;
    this.montureForm.reset();
  }

  private addMonture(monture : MontureModel) {
    this.montureService.addMonture(monture).subscribe(data=>{
      console.log(data);
      this.loading = false;
      this.montureService.getAllMontures();
      this.router.navigate(['/montures']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

  private updateMonture(monture : MontureModel) {
    monture.id = this.monture.id;
    this.montureService.updateMonture(this.monture).subscribe(data=>{
      console.log(data);
      this.loading = false;
      this.montureService.getAllMontures();
      this.router.navigate(['/montures']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }


}
