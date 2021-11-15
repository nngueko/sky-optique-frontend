import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {LivraisonModel} from "../models/livraison.model";
import {ProduitModel} from "../models/produit.model";
import {TypeProduit} from "../type-produit";
import {LentilleService} from "../services/lentille.service";
import {MontureService} from "../services/monture.service";
import {Observable, Subscription} from "rxjs";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-edit-livraison',
  templateUrl: './edit-livraison.component.html',
  styleUrls: ['./edit-livraison.component.css']
})


export class EditLivraisonComponent implements OnInit {

  livraisonForm: FormGroup;
  isAddMode = false;
  loading = false;
  public typeProduit: TypeProduit;
  produit: ProduitModel;
  listProduit: ProduitModel[];
  filteredOptions: Observable<ProduitModel[]>;
  listSubscription : Subscription;
  produitControl = new FormControl();

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private lentilleService : LentilleService,
              private montureServiceService : MontureService) { }

  ngOnInit() {
    this.initForm(new LivraisonModel(null, null, null, null, null, ));
    this.filteredOptions = this.produitControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.listProduit.slice())
      );
  }

  displayFn(produit: ProduitModel): string {
    return produit && produit.libelle ? produit.libelle : '';
  }

  private _filter(libelle: string): ProduitModel[] {
    const filterValue = libelle.toLowerCase();
    return this.listProduit.filter(produit => produit.libelle.toLowerCase().includes(filterValue));
  }

  initForm(livraison : LivraisonModel) {
    this.livraisonForm = this.formBuilder.group({
      prixAchat: ['', Validators.required, Validators.min(0)],
      qte: ['', Validators.required, Validators.min(1)],
      date: ['', [Validators.required]],

    });
  }

  onSubmitForm(){
    const formValue = this.livraisonForm.value;

    this.loading = true;
    if (this.isAddMode) {
      this.createLivraison();
    } else {

      this.updateLivraison();
    }

  }

  private createLivraison() {

  }

  private updateLivraison() {

  }
}
