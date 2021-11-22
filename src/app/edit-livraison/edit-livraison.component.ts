import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormsModule, NgForm, FormArray, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {LivraisonModel} from "../models/livraison.model";
import {ProduitModel} from "../models/produit.model";
import {LentilleService} from "../services/lentille.service";
import {MontureService} from "../services/monture.service";
import {Observable, Subject, Subscription} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {ProduitService} from "../services/produit.service";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {BonLivraisonModel} from "../models/bonLivraison.model";
import {BonLivraisonService} from "../services/BonLivraison.service";

@Component({
  selector: 'app-edit-livraison',
  templateUrl: './edit-livraison.component.html',
  styleUrls: ['./edit-livraison.component.css']
})


export class EditLivraisonComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private produitService : ProduitService,
  ) { }

  ngOnInit() {

  }


}
