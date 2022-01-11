import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MontureModel} from "../models/monture.model";
import {MontureService} from "../services/monture.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CompagniModel} from "../models/compagni.model";
import {Subscription} from "rxjs";
import {MarqueModel} from "../models/marque.model";
import {MarqueService} from "../services/marque.service";

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

  listMarques : MarqueModel[]=[];
  listMarqueSubscription : Subscription;

  constructor(private formBuilder: FormBuilder,
              private montureService : MontureService,
              private marqueService : MarqueService,
              private router: Router,
              private route: ActivatedRoute) {
    this.monture.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.monture.id;
    this.initForm(this.monture);

    this.listMarqueSubscription = this.marqueService.listMarqueSubject.subscribe(
      data => {
        this.listMarques = data;
      }, error => {
        console.log('Error ! : ' + error);
      }
    );
    this.marqueService.getAllMarques();

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

  ngOnDestroy(): void {
    this.listMarqueSubscription.unsubscribe();
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
      coloris: monture.coloris,
      lngBrn: monture.lngBrn,
      catAge: monture.catAge,
      idMarque: monture.marque ? monture.marque.id : null,
    });
  }

  get f() { return this.montureForm.controls; }

  onSubmitForm() {
    this.submitted = true;
    if (this.montureForm.invalid) {
      return;
    }
    const formValue = this.montureForm.value;
    let editedMonture = this.monture;

    editedMonture.reference=formValue['reference'] ? ( <string>formValue['reference']).trim() : formValue['reference'];
    editedMonture.modele= formValue['modele'] ? (<string> formValue['modele']).trim() : formValue['modele'];
    editedMonture.matiere= formValue['matiere'] ? (<string> formValue['matiere']).trim() : formValue['matiere'];
    editedMonture.genre= formValue['genre'] ? (<string> formValue['genre']).trim() : formValue['genre'];
    editedMonture.taille= formValue['taille'] ? (<string> formValue['taille']).trim() : formValue['taille'];
    editedMonture.forme= formValue['forme'] ? (<string> formValue['forme']).trim() : formValue['forme'];
    editedMonture.libelle = (<string> formValue['libelle']).trim();
    if(formValue['idMarque']){
      editedMonture.marque = this.listMarques.filter(opt => opt.id == formValue['idMarque'])[0];
    }
    else {
      editedMonture.marque = null;
    }

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
