import { Component, OnInit } from '@angular/core';
import {MontureModel} from "../models/monture.model";
import {LentilleModel} from "../models/lentille.model";
import {MontureService} from "../services/monture.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LentilleService} from "../services/lentille.service";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-lentille',
  templateUrl: './edit-lentille.component.html',
  styleUrls: ['./edit-lentille.component.css']
})
export class EditLentilleComponent implements OnInit {

  isAddMode: boolean;
  lentilleForm: FormGroup;
  submitted = false;
  loading = false;
  lentille = new LentilleModel(null, null, null, null, null);

  constructor(private formBuilder: FormBuilder, private lentilleService : LentilleService, private router: Router, private route: ActivatedRoute) {
    this.lentille.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.lentille.id;
    this.initForm(this.lentille);
    if (!this.isAddMode) {
      this.loading = true;
      this.lentilleService.getLentilleById(this.lentille.id).subscribe((response) => {
        this.lentille = response;
        this.initForm(this.lentille);
        },(error) => {
          console.log('Erreur ! : ' + error);
        }
      );
      this.loading = false;
    }

  }

  initForm(lentille : LentilleModel){
    this.lentilleForm = this.formBuilder.group({
      libelle: [lentille.libelle, Validators.compose([Validators.required])],
      //type: lentille.type,
      sphere: [lentille.sphere, Validators.compose([Validators.required])],
      cylindre: [lentille.cylindre, Validators.compose([Validators.required])],
      axe: lentille.axe,
      addition: lentille.addition
    });
  }

  get f() { return this.lentilleForm.controls; }

  onSubmitForm() {
    this.submitted = true;
    if (this.lentilleForm.invalid) {
      return;
    }
    const formValue = this.lentilleForm.value;
    let editedLentille = this.lentille;
    editedLentille.sphere = <number> formValue['sphere'];
    editedLentille.cylindre = <number> formValue['cylindre'];
    editedLentille.axe = <number> formValue['axe'];
    editedLentille.addition = <number> formValue['addition'];
    editedLentille.libelle = (<string> formValue['libelle']).trim();
    console.log(editedLentille);

    if (this.isAddMode) {
      this.addLentille(editedLentille);
    } else {
      this.updateLentille(editedLentille);
    }
  }

  onReset() {
    this.submitted = false;
    this.lentilleForm.reset();
  }


  private addLentille(lentille : LentilleModel) {
    this.lentilleService.addLentille(lentille).subscribe(data=>{
      console.log(data);
      this.loading = false;
      this.lentilleService.getAllLentilles();
      this.router.navigate(['/lentilles']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

  private updateLentille(lentille : LentilleModel) {
    lentille.id = this.lentille.id;
    this.lentilleService.updateLentille(lentille).subscribe(data=>{
      console.log(data);
      this.lentilleService.getAllLentilles();
      this.router.navigate(['/lentilles']);
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }

}
