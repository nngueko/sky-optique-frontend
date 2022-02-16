import { Component, OnInit } from '@angular/core';
import {LentilleModel} from "../models/lentille.model";
import {ActivatedRoute, Router} from "@angular/router";
import {LentilleService} from "../services/lentille.service";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {StockModel} from "../models/stockModel";
import {MontureModel} from "../models/monture.model";
import {StockService} from "../services/stock.service";

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
  stock = new StockModel(null, null, null, null, new LentilleModel(null, null, null, null));
  lentille = new LentilleModel(null, null, null, null, null);

  constructor(private formBuilder: FormBuilder, private stockService :  StockService, private lentilleService : LentilleService, private router: Router, private route: ActivatedRoute) {
    this.stock.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isAddMode = !this.stock.id;
    this.initForm(this.stock);

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

  initForm(stock : StockModel){
    let lentille: LentilleModel = stock.produit as LentilleModel;
    this.lentilleForm = this.formBuilder.group({
      libelle: [lentille.libelle, Validators.compose([Validators.required])],
      //type: lentille.type,
      sphere: [lentille.sphere, Validators.compose([Validators.required])],
      cylindre: [lentille.cylindre, Validators.compose([Validators.required])],
      axe: lentille.axe,
      addition: lentille.addition,
      qte: [stock.qte, Validators.compose([Validators.required, Validators.min(0)])],
      prixVente: [stock.prixVente, Validators.compose([Validators.required, Validators.min(0)])],
    });
  }

  get f() { return this.lentilleForm.controls; }

  onSubmitForm() {
    this.submitted = true;
    if (this.lentilleForm.invalid) {
      return;
    }
    const formValue = this.lentilleForm.value;
    let editedStock = this.stock;
    let editedLentille = this.stock.produit as LentilleModel;

    editedLentille.sphere = <number> formValue['sphere'];
    editedLentille.cylindre = <number> formValue['cylindre'];
    editedLentille.axe = <number> formValue['axe'];
    editedLentille.addition = <number> formValue['addition'];
    editedLentille.libelle = (<string> formValue['libelle']).trim();
    editedStock.produit = editedLentille;
    editedStock.prixVente = formValue['prixVente'];
    editedStock.qte = formValue['qte'];

    if (this.isAddMode) {
      this.addLentille(editedStock);
    } else {
      this.updateLentille(editedStock);
    }
  }

  onReset() {
    this.submitted = false;
    this.lentilleForm.reset();
  }


  private addLentille(stock : StockModel) {
    this.lentilleService.addLentille(stock.produit as LentilleModel).subscribe(data1=>{
      stock.produit = data1 as LentilleModel;
      this.stockService.addStock(stock).subscribe(data2=>{
        console.log(data2);
        this.loading = false;
        this.stockService.getAllStockLentille();
        this.router.navigate(['/lentilles']);
      }, error => {
        console.log('Error ! : ' + error);
      });
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });

  }

  private updateLentille(stock : StockModel) {
    this.lentilleService.updateLentille(stock.produit as LentilleModel).subscribe(data1=>{
      stock.produit = data1 as LentilleModel;
      this.stockService.updateStock(stock).subscribe(data2=>{
        console.log(data2);
        this.loading = false;
        this.stockService.getAllStockLentille();
        this.router.navigate(['/lentilles']);
      }, error => {
        console.log('Error ! : ' + error);
      });
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });

  }

}
