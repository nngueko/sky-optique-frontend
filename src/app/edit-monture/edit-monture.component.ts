import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MontureModel} from "../models/monture.model";
import {MontureService} from "../services/monture.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {MarqueModel} from "../models/marque.model";
import {MarqueService} from "../services/marque.service";
import {StockModel} from "../models/stockModel";
import {StockService} from "../services/stock.service";

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
  stock = new StockModel(null, null, null, null, new MontureModel(null, null, null, null, null, null, null));
  monture = new MontureModel(null, null, null, null, null, null, null);

  listMarques : MarqueModel[]=[];
  listMarqueSubscription : Subscription;

  constructor(private formBuilder: FormBuilder,
              private montureService :  MontureService,
              private stockService :  StockService,
              private marqueService : MarqueService,
              private router: Router,
              private route: ActivatedRoute) {
    this.stock.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.stock.id;
    this.initForm(this.stock);

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
      this.stockService.getStockById(this.stock.id).subscribe((response) => {
        this.stock = response;
        this.initForm(this.stock);
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


  initForm(stock : StockModel){
    let monture: MontureModel = stock.produit as MontureModel;
    this.montureForm = this.formBuilder.group({
      reference: [monture.reference, Validators.compose([Validators.required])],
      //libelle: [monture.libelle, Validators.compose([Validators.required])],
      modele: monture.modele,
      matiere: monture.matiere,
      genre: monture.genre,
      taille: monture.taille,
      forme: monture.forme,
      coloris: monture.coloris,
      lngBrn: monture.lngBrn,
      catAge: monture.catAge,
      idMarque: monture.marque ? monture.marque.id : null,
      qte: [stock.qte, Validators.compose([Validators.required, Validators.min(0)])],
      prixVente: [stock.prixVente, Validators.compose([Validators.required, Validators.min(0)])],
    });
  }

  get f() { return this.montureForm.controls; }

  onSubmitForm() {
    this.submitted = true;
    if (this.montureForm.invalid) {
      return;
    }
    const formValue = this.montureForm.value;
    let editedStock = this.stock;
    console.log(editedStock);
    let editedMonture = this.stock.produit as MontureModel;

    editedMonture.reference=formValue['reference'] ? ( <string>formValue['reference']).trim() : formValue['reference'];
    editedMonture.modele= formValue['modele'] ? (<string> formValue['modele']).trim() : formValue['modele'];
    editedMonture.matiere= formValue['matiere'] ? (<string> formValue['matiere']).trim() : formValue['matiere'];
    editedMonture.genre= formValue['genre'] ? (<string> formValue['genre']).trim() : formValue['genre'];
    editedMonture.taille= formValue['taille'] ? (<string> formValue['taille']).trim() : formValue['taille'];
    editedMonture.forme= formValue['forme'] ? (<string> formValue['forme']).trim() : formValue['forme'];
    editedMonture.libelle = editedMonture.reference
    if(formValue['idMarque']){
      editedMonture.marque = this.listMarques.filter(opt => opt.id == formValue['idMarque'])[0];
    }
    else {
      editedMonture.marque = null;
    }
    editedStock.produit = editedMonture;
    editedStock.prixVente = formValue['prixVente'];
    editedStock.qte = formValue['qte'];

    console.log(editedMonture);

    if (this.isAddMode) {
      this.addMonture(editedStock);
    } else {
      this.updateMonture(editedStock);
    }

  }

  onReset() {
    this.submitted = false;
    this.montureForm.reset();
  }

  private addMonture(stock : StockModel) {
    this.montureService.addMonture(stock.produit as MontureModel).subscribe(data1=>{
      stock.produit = data1 as MontureModel;
      console.log(stock.produit);
      console.log(stock);
      this.stockService.addStock(stock).subscribe(data2=>{
        console.log(data2);
        this.loading = false;
        this.stockService.getAllStockMonture();
        this.router.navigate(['/montures']);
      }, error => {
        console.log('Error ! : ' + error);
      });
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });

  }

  private updateMonture(stock : StockModel) {
    stock.id = this.stock.id;
    this.montureService.updateMonture(stock.produit as MontureModel).subscribe(data1=>{
      stock.produit = data1 as MontureModel;
      console.log(stock.produit);
      console.log(stock);
      this.stockService.updateStock(stock).subscribe(data2=>{
        console.log(data2);
        this.loading = false;
        this.stockService.getAllStockMonture();
        this.router.navigate(['/montures']);
      }, error => {
        console.log('Error ! : ' + error);
      });
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });
  }


}
