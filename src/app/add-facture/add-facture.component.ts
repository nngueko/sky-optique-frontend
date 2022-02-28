import {Component, OnInit, ViewChild} from '@angular/core';
import {PersonneModel} from "../models/personne.model";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {FactureService} from "../services/facture.service";
import {CompagniModel} from "../models/compagni.model";
import {CompagniService} from "../services/compagni.service";
import {Observable, Subscription} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {PersonneService} from "../services/personne.service";
import {StockModel} from "../models/stockModel";
import {StockService} from "../services/stock.service";
import {FactureClientService} from "../services/factureClient.service";
import {MontureModel} from "../models/monture.model";
import {LentilleModel} from "../models/lentille.model";
import {PrescriptionModel} from "../models/prescription.model";
import {VenteModel} from "../models/vente.model";
import {FactureModel} from "../models/facture.model";
import {FactureClientModel} from "../models/factureClient.model";
import {CouvertureModel} from "../models/couverture.model";
import {PrescripteurService} from "../services/prescripteur.service";
import {PrescripteurModel} from "../models/prescripteur.model";
import {ProformaService} from "../services/proforma.service";
import {MarqueModel} from "../models/marque.model";
import {MarqueService} from "../services/marque.service";
import {MontureService} from "../services/monture.service";
import {LentilleService} from "../services/lentille.service";

@Component({
  selector: 'app-add-facture',
  templateUrl: './add-facture.component.html',
  styleUrls: ['./add-facture.component.css']
})
export class AddFactureComponent implements OnInit {

  aPayer : number =0;

  listStocks : StockModel[]=[];
  listStocksSubscription : Subscription;

  monture : StockModel ;
  montureControl = new FormControl();
  filteredMontures : Observable<StockModel[]>;
  listMontures : StockModel[]=[];
  montureTriggerSubscription : Subscription;
  @ViewChild('autoCompleteMonture', { read: MatAutocompleteTrigger }) triggerMonture: MatAutocompleteTrigger;

  lentilleG : StockModel;
  lentilleGProd : LentilleModel;
  lentilleD : StockModel;
  lentilleDProd : LentilleModel;
  lentilleGControl = new FormControl();
  lentilleDControl = new FormControl();
  filteredLentilleG : Observable<StockModel[]>;
  filteredLentilleD : Observable<StockModel[]>;
  lentilleGTriggerSubscription : Subscription;
  lentilleDTriggerSubscription : Subscription;
  @ViewChild('autoCompleteLentilleG', { read: MatAutocompleteTrigger }) triggerLentilleG: MatAutocompleteTrigger;
  @ViewChild('autoCompleteLentilleD', { read: MatAutocompleteTrigger }) triggerLentilleD: MatAutocompleteTrigger;
  listLentilles : StockModel[]=[];

  patient : PersonneModel = null;
  assurePrincipal : PersonneModel = null;
  filteredPatients : Observable<PersonneModel[]>;
  filteredAssurePrincipals : Observable<PersonneModel[]>;
  listPatients : PersonneModel[]=[];
  listPersonnesSubscription : Subscription;
  patientTriggerSubscription : Subscription;
  assurePrincipalTriggerSubscription : Subscription;
  @ViewChild('autoCompletePatient2', { read: MatAutocompleteTrigger }) triggerAssurePrincipal: MatAutocompleteTrigger;
  @ViewChild('autoCompletePatient', { read: MatAutocompleteTrigger }) triggerPatient: MatAutocompleteTrigger;

  prescripteur : PersonneModel = null;
  filteredPrescripteurs : Observable<PersonneModel[]>;
  listPrescripteurs : PersonneModel[]=[];
  listPrescripteursSubscription : Subscription;
  prescripteurTriggerSubscription : Subscription;
  @ViewChild('autoCompletePrescripteur', { read: MatAutocompleteTrigger }) triggerPrescripteur: MatAutocompleteTrigger;

  entreprise : CompagniModel;
  filteredEntreprises : Observable<CompagniModel[]>;
  assurance : CompagniModel;
  filteredAssurances : Observable<CompagniModel[]>;
  listEntreprises : CompagniModel[]=[];
  listAssurances : CompagniModel[]=[];
  listEntreprisesSubscription : Subscription;
  entrepriseTriggerSubscription : Subscription;
  assuranceTriggerSubscription : Subscription;
  @ViewChild('autoCompleteEntreprise', { read: MatAutocompleteTrigger }) triggerEntreprise: MatAutocompleteTrigger;
  @ViewChild('autoCompleteAssurance', { read: MatAutocompleteTrigger }) triggerAssurance: MatAutocompleteTrigger;

  factureForm: FormGroup;
  submitted = false;
  loading = false;


  montureForm: FormGroup;
  submittedMontureForm = false;
  listMarques : MarqueModel[]=[];
  listMarqueSubscription : Subscription;

  lentilleGForm: FormGroup;
  submittedLentilleGForm = false;

  lentilleDForm: FormGroup;
  submittedLentilleDForm = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private factureService : FactureService,
              private compagniService : CompagniService,
              private personneService : PersonneService,
              private prescripteurService : PrescripteurService,
              private factureClientService : FactureClientService,
              private proformaService : ProformaService,
              private stockService : StockService,
              private montureService :  MontureService,
              private lentilleService :  LentilleService,
              private marqueService : MarqueService,
              ) { }

  ngOnInit(): void {
    this.initForm();
    this.onAddCouverture();
    this.onAddPrescription();

    this.listEntreprisesSubscription = this.compagniService.listCompagniSubject.subscribe(
      data => {
        this.listEntreprises = data;
        this.listAssurances = this.listEntreprises.filter(entr => entr.type == "assurance");
      }, error => {
        console.log('Error ! : ' + error);
      }
    );
    this.compagniService.getAllCompagnis();

    this.listPersonnesSubscription = this.personneService.listPersonneSubject.subscribe(
      data => {
        this.listPatients = data;
        this.listPrescripteurs = this.listPatients.filter(pers => pers.discriminator == "PRESCRIPTEUR");
      }, error => {
        console.log('Error ! : ' + error);
      }
    );
    this.personneService.getAllPersonnes();
    this.filteredPatients = this.factureForm.get('nomPatient').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : ''),
      map(nom => nom ? this._filterPatient(nom) : this.listPatients.slice())
    );

    this.filteredAssurePrincipals = this.couverture.at(0).get('nomAssurePrincipal').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : ''),
      map(nom => nom ? this._filterPatient(nom) : this.listPatients.slice())
    );
    this.filteredPrescripteurs = this.prescription.at(0).get('nomPrescripteur').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : ''),
      map(nom => nom ? this._filterPrescripteur(nom) : this.listPrescripteurs.slice())
    );
    this.filteredEntreprises = this.couverture.at(0).get('entrepriseAssurePrincipal').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : ''),
      map(nom => nom ? this._filterEntreprise(nom) : this.listEntreprises.slice())
    );
    this.filteredAssurances = this.couverture.at(0).get('assurance').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : ''),
      map(nom => nom ? this._filterAssurance(nom) : this.listAssurances.slice())
    );

    this.listStocksSubscription = this.stockService.listStockSubject.subscribe(
      data => {
        this.listStocks = data;
        this.listMontures = this.listStocks.filter(stock => stock.produit.discriminator=="M");
        this.listLentilles = this.listStocks.filter(stock => stock.produit.discriminator=="L");
        console.log(this.listMontures);
        console.log(this.listLentilles);
      }, error => {
        console.log('Error ! : ' + error);
      }
    );
    this.stockService.getAllStocks();
    this.filteredMontures = this.montureControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.libelle),
      map(libelle => libelle ? this._filterMonture(libelle) : this.listMontures.slice())
    );
    this.filteredLentilleG = this.lentilleGControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.libelle),
      map(libelle => libelle ? this._filterLentille(libelle) : this.listLentilles.slice())
    );
    this.filteredLentilleD = this.lentilleDControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.libelle),
      map(libelle => libelle ? this._filterLentille(libelle) : this.listLentilles.slice())
    );

    this.listMarqueSubscription = this.marqueService.listMarqueSubject.subscribe(
      data => {
        this.listMarques = data;
      }, error => {
        console.log('Error ! : ' + error);
      }
    );
    this.marqueService.getAllMarques();
    this.initMontureForm();
    this.initLentilleGForm();
    this.initLentilleDForm();

  }

  ngOnDestroy(): void {
    this.listStocksSubscription.unsubscribe();
    this.listEntreprisesSubscription.unsubscribe();
    this.listPersonnesSubscription.unsubscribe();
    this.patientTriggerSubscription.unsubscribe();
    this.assurePrincipalTriggerSubscription.unsubscribe();
    this.prescripteurTriggerSubscription.unsubscribe();
    this.montureTriggerSubscription.unsubscribe();
    this.lentilleGTriggerSubscription.unsubscribe();
    this.lentilleDTriggerSubscription.unsubscribe();
    this.listMarqueSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.patientTriggerSubscription = this.triggerPatient.panelClosingActions.subscribe(e => {
      if (!e) {
        if(this.patient != null){
          this.patient = null;
          this.onInitPatientForm(new PersonneModel(null, null, null, new CompagniModel(), null, null));
          this.onEnablePatientForm();
        }
      }
    },e => console.log('error', e));

    this.assurePrincipalTriggerSubscription = this.triggerAssurePrincipal.panelClosingActions.subscribe(e => {
      if (!e) {
        if(this.assurePrincipal != null){
          this.assurePrincipal = null;
          this.onInitAssurePrincipalForm(new PersonneModel(null, null, null, new CompagniModel(), null));
          this.onEnableAssurePrincipalForm();
        }
      }
    },e => console.log('error', e));

    this.prescripteurTriggerSubscription = this.triggerPrescripteur.panelClosingActions.subscribe(e => {
      if (!e) {
        if(this.prescripteur != null){
          this.prescripteur = null;
          //this.onInitPatientForm(new PersonneModel(null, null, null, null, new CompagniModel()));
        }
      }
    },e => console.log('error', e));

    this.entrepriseTriggerSubscription = this.triggerEntreprise.panelClosingActions.subscribe(e => {
      if (!e) {
        if(this.entreprise != null){
          this.entreprise = null;
        }
      }
    },e => console.log('error', e));
    this.assuranceTriggerSubscription = this.triggerAssurance.panelClosingActions.subscribe(e => {
      if (!e) {
        if(this.assurance != null){
          this.assurance = null;
        }
      }
    },e => console.log('error', e));

    this.montureTriggerSubscription = this.triggerMonture.panelClosingActions.subscribe(e => {
      if (!e) {
        this.monture = null;
        this.montureControl.setValue(new MontureModel('null',null,null,null, null, null));
        this.factureForm.get('qteMonture').reset(1);
        this.factureForm.get('remiseMonture').reset(0);
        this.onCalculValeurs();
      }
    },e => console.log('error', e));

    this.lentilleGTriggerSubscription = this.triggerLentilleG.panelClosingActions.subscribe(e => {
      if (!e) {
        this.lentilleG = null;
        this.lentilleGProd = null;
        this.lentilleGControl.setValue(new LentilleModel(null,null,null,null));
        this.factureForm.get('qteLentilleG').reset(1);
        this.factureForm.get('remiseLentilleG').reset(0);
        this.onCalculValeurs();
      }
    },e => console.log('error', e));
    this.lentilleDTriggerSubscription = this.triggerLentilleD.panelClosingActions.subscribe(e => {
      if (!e) {
        this.lentilleD = null;
        this.lentilleDProd = null;
        this.lentilleDControl.setValue(new LentilleModel(null,null,null,null));
        this.factureForm.get('qteLentilleD').reset(1);
        this.factureForm.get('remiseLentilleD').reset(0);
        this.onCalculValeurs();
      }
    },e => console.log('error', e));

  }

  private _filterPatient(value: string): PersonneModel[] {
    const filterValue = value.toLowerCase();
    return this.listPatients.filter(option => {
      if(option.prenom == null)
        return option.nom.toLowerCase().includes(filterValue.trim())
      else
        return (option.nom.toLowerCase()+' '+option.prenom.toLowerCase()).includes(filterValue.trim())
    });
  }
  displayPatient(patient: PersonneModel): string {
    if(patient && patient.nom){
      return patient.nom;
    }
    return '';
  }
  getPatient(event) {
    this.patient = event.option.value;
    this.onInitPatientForm(this.patient);
  }
  onInitPatientForm(patient: PersonneModel){
    //this.factureForm.get('nom').setValue(patient.nom);
    this.factureForm.get('prenomPatient').setValue(patient.prenom);
    this.factureForm.get('dateNaissPatient').setValue(patient.dateNaiss);
    this.factureForm.get('adressePatient').setValue(patient.adresse);
    this.factureForm.get('emailPatient').setValue(patient.email);
    this.factureForm.get('tel1Patient').setValue(patient.tel1);
    this.factureForm.get('tel2Patient').setValue(patient.tel2);
    this.factureForm.get('civilitePatient').setValue(patient.civilite);
    this.factureForm.get('idEntreprisePatient').setValue(patient.entreprise ? patient.entreprise.id : null);
    if(patient.id == null)
      this.onEnablePatientForm();
    else
      this.onDisablePatientForm();
  }
  onDisablePatientForm(){
    this.factureForm.get('prenomPatient').disable();
    this.factureForm.get('dateNaissPatient').disable();
    this.factureForm.get('adressePatient').disable();
    this.factureForm.get('emailPatient').disable();
    this.factureForm.get('tel1Patient').disable();
    this.factureForm.get('tel2Patient').disable();
    this.factureForm.get('civilitePatient').disable();
    this.factureForm.get('idEntreprisePatient').disable();
  }
  onEnablePatientForm(){
    this.factureForm.get('prenomPatient').enable();
    this.factureForm.get('dateNaissPatient').enable();
    this.factureForm.get('adressePatient').enable();
    this.factureForm.get('emailPatient').enable();
    this.factureForm.get('tel1Patient').enable();
    this.factureForm.get('tel2Patient').enable();
    this.factureForm.get('civilitePatient').enable();
    this.factureForm.get('idEntreprisePatient').enable();
  }

  private _filterPrescripteur(value: string): PersonneModel[] {
    const filterValue = value.toLowerCase();
    let val='';
    return this.listPrescripteurs.filter(option => {
      let val='';
      if(option.nom != null)
        val = val+option.nom+' ';
      if(option.prenom != null)
        val = val+option.prenom;
      return val.toLowerCase().includes(filterValue.trim())
    });
  }
  displayPrescripteur(prescripteur: PersonneModel): string {
    let val='';
    if(prescripteur){
      if(prescripteur.nom != null)
        val = val+prescripteur.nom+' ';
      if(prescripteur.prenom != null)
        val = val+prescripteur.prenom;
    }
    return val.trim();
  }
  getPrescripteur(event) {
    this.prescripteur = event.option.value;
  }

  private _filterEntreprise(value: string): CompagniModel[] {
    const filterValue = value.toLowerCase();
    return this.listEntreprises.filter(option => option.nom.toLowerCase().includes(filterValue.trim()));
  }
  private _filterAssurance(value: string): CompagniModel[] {
    const filterValue = value.toLowerCase();
    return this.listAssurances.filter(option => option.nom.toLowerCase().includes(filterValue.trim()));
  }
  displayEntreprise(entreprise: CompagniModel): string {
    if(entreprise && entreprise.nom){
      return entreprise.nom;
    }
    return '';
  }
  getEntreprise(event) {
    this.entreprise = event.option.value;
  }
  getAssurance(event) {
    this.assurance = event.option.value;
  }

  getAssurePrincipal(event) {
    this.assurePrincipal = event.option.value;
    this.onInitAssurePrincipalForm(this.assurePrincipal);
  }
  onInitAssurePrincipalForm(patient: PersonneModel){
    //this.factureForm.get('nom').setValue(patient.nom);
    this.couverture.at(0).get('prenomAssurePrincipal').setValue(patient.prenom);
    this.couverture.at(0).get('dateNaissAssurePrincipal').setValue(patient.dateNaiss);
    this.couverture.at(0).get('adresseAssurePrincipal').setValue(patient.adresse);
    this.couverture.at(0).get('emailAssurePrincipal').setValue(patient.email);
    this.couverture.at(0).get('tel1AssurePrincipal').setValue(patient.tel1);
    this.couverture.at(0).get('civiliteAssurePrincipal').setValue(patient.civilite);
    this.couverture.at(0).get('entrepriseAssurePrincipal').setValue(patient.entreprise ? patient.entreprise.id : null);
    if(patient.id == null)
      this.onEnableAssurePrincipalForm();
    else
      this.onDisableAssurePrincipalForm();
  }
  onDisableAssurePrincipalForm(){
    if(this.couverture.length == 1){
      this.couverture.at(0).get('prenomAssurePrincipal').disable();
      this.couverture.at(0).get('dateNaissAssurePrincipal').disable();
      this.couverture.at(0).get('adresseAssurePrincipal').disable();
      this.couverture.at(0).get('emailAssurePrincipal').disable();
      this.couverture.at(0).get('tel1AssurePrincipal').disable();
      this.couverture.at(0).get('civiliteAssurePrincipal').disable();
    }
  }
  onEnableAssurePrincipalForm(){
    if(this.couverture.length == 1){
      this.couverture.at(0).get('prenomAssurePrincipal').enable();
      this.couverture.at(0).get('dateNaissAssurePrincipal').enable();
      this.couverture.at(0).get('adresseAssurePrincipal').enable();
      this.couverture.at(0).get('emailAssurePrincipal').enable();
      this.couverture.at(0).get('tel1AssurePrincipal').enable();
      this.couverture.at(0).get('civiliteAssurePrincipal').enable();
    }
  }


  displayProduit(stock: StockModel): string {
    if(stock && stock.produit){
      return stock.produit.libelle;
    }
    return '';
  }
  private _filterMonture(value: string): StockModel[] {
    const filterValue = value.toLowerCase();
    return this.listMontures.filter(option => option.produit.libelle.toLowerCase().includes(filterValue.trim()));
  }
  private _filterLentille(value: string): StockModel[] {
    const filterValue = value.toLowerCase();
    return this.listLentilles.filter(option => option.produit.libelle.toLowerCase().includes(filterValue.trim()));
  }
  getMonture(event) {
    this.monture = event.option.value;
    this.onCalculValeurs();
  }
  getLentilleG(event) {
    this.lentilleG = event.option.value;
    this.lentilleGProd =this.lentilleG.produit as LentilleModel;
    this.onCalculValeurs();
  }
  getLentilleD(event) {
    this.lentilleD = event.option.value;
    this.lentilleDProd =this.lentilleD.produit as LentilleModel;
    this.onCalculValeurs();
  }

  initMontureForm(){
    this.montureForm = this.formBuilder.group({
      reference: ['', Validators.compose([Validators.required])],
      modele: null,
      matiere: null,
      genre: null,
      taille: null,
      forme: null,
      coloris: null,
      lngBrn: null,
      catAge: null,
      idMarque: null,
      qte: [null, Validators.compose([Validators.required, Validators.min(0)])],
      prixVente: [null, Validators.compose([Validators.required, Validators.min(0)])],
    });
  }
  get fM() { return this.montureForm.controls; }
  initLentilleGForm(){
    this.lentilleGForm = this.formBuilder.group({
      libelle: ['', Validators.compose([Validators.required])],
      //type: lentille.type,
      sphere: [null, Validators.compose([Validators.required])],
      cylindre: [null, Validators.compose([Validators.required])],
      axe: null,
      addition: null,
      qte: [null, Validators.compose([Validators.required, Validators.min(0)])],
      prixVente: [null, Validators.compose([Validators.required, Validators.min(0)])],
    });
  }
  get fLG() { return this.lentilleGForm.controls; }
  initLentilleDForm(){
    this.lentilleDForm = this.formBuilder.group({
      libelle: ['', Validators.compose([Validators.required])],
      //type: lentille.type,
      sphere: [null, Validators.compose([Validators.required])],
      cylindre: [null, Validators.compose([Validators.required])],
      axe: null,
      addition: null,
      qte: [null, Validators.compose([Validators.required, Validators.min(0)])],
      prixVente: [null, Validators.compose([Validators.required, Validators.min(0)])],
    });
  }
  get fLD() { return this.lentilleDForm.controls; }

  initForm(){
    this.factureForm = this.formBuilder.group({
      civilitePatient: new FormControl(),
      nomPatient: [null, Validators.compose([Validators.required])],
      prenomPatient: new FormControl(),
      dateNaissPatient: new FormControl(),
      emailPatient: [null, Validators.compose([Validators.email])],
      adressePatient: new FormControl(),
      tel1Patient: new FormControl(),
      tel2Patient: new FormControl(),
      idEntreprisePatient: new FormControl(),

      prescription: this.formBuilder.array([]),
      couverture: this.formBuilder.array([]),

      qteMonture: [1, Validators.compose([Validators.required, Validators.min(1)])],
      qteLentilleG: [1, Validators.compose([Validators.required, Validators.min(1)])],
      qteLentilleD: [1, Validators.compose([Validators.required, Validators.min(1)])],
      remiseMonture:[0, Validators.compose([Validators.min(0)])],
      remiseLentilleG: 0,
      remiseLentilleD: 0,
      montantMonture: 0,
      montantLentilleG: 0,
      montantLentilleD: 0,
      totalMonture: 0,
      totalLentilleG: new FormControl(),
      totalLentilleD : new FormControl(),

      /*civiliteAssurePrincipal: new FormControl(),
      nomAssurePrincipal: [null, Validators.compose([Validators.required])],
      prenomAssurePrincipal: new FormControl(),
      dateNaissAssurePrincipal: new FormControl(),
      emailAssurePrincipal: [null, Validators.compose([Validators.email])],
      adresseAssurePrincipal: new FormControl(),
      tel1AssurePrincipal: new FormControl(),
      entrepriseAssurePrincipal : ['', Validators.compose([Validators.required])],

      assurance : ['', Validators.compose([Validators.required])],
      couvertureVerre : ['', Validators.compose([Validators.required, Validators.min(0), Validators.max(100)])],
      couvertureMonture : ['', Validators.compose([Validators.required, Validators.min(0), Validators.max(100)])],
      numeroDocument : '',
      dateDocument : '',
      relation : '',*/

      priseEnCharge : 0,
      franchise : 0,

    });
  }
  get f() { return this.factureForm.controls; }

  get prescription(): FormArray {
    return this.factureForm.get('prescription') as FormArray;
  }
  onAddPrescription(){
    this.prescription.push(this.formBuilder.group({
      nomPrescripteur: ['', Validators.compose([Validators.required])],
      //prenomPrescripteur: new FormControl(),
      datePrescription: new FormControl(),
      dateLimite: new FormControl(),
      eyeVision: new FormControl(),
      port: new FormControl()
    }));
  }
  onDeletePrescription(index: number){
    this.prescription.removeAt(index);
  }

  get couverture(): FormArray {
    return this.f.couverture as FormArray;
  }
  onAddCouverture(){
    this.couverture.push(this.formBuilder.group({
      civiliteAssurePrincipal: new FormControl(),
      nomAssurePrincipal: [null, Validators.compose([Validators.required])],
      prenomAssurePrincipal: new FormControl(),
      dateNaissAssurePrincipal: new FormControl(),
      emailAssurePrincipal: [null, Validators.compose([Validators.email])],
      adresseAssurePrincipal: new FormControl(),
      tel1AssurePrincipal: new FormControl(),
      entrepriseAssurePrincipal : ['', Validators.compose([Validators.required])],

      assurance : ['', Validators.compose([Validators.required])],
      couvertureVerre : ['', Validators.compose([Validators.required, Validators.min(0), Validators.max(100)])],
      couvertureMonture : ['', Validators.compose([Validators.required, Validators.min(0), Validators.max(100)])],
      numeroDocument : '',
      dateDocument : '',
      relation : ''
    }));
    this.onCalculValeurs();
  }
  onDeleteCouverture(index: number){
    this.couverture.removeAt(index);
    this.onCalculValeurs();
  }

  onCalculValeurs(){
    console.log("onCalculValeurs()")

    if(this.monture != null) {
      this.f.montantMonture.setValue(this.monture.prixVente * (1 - this.f.remiseMonture.value/100));
      this.f.totalMonture.setValue(this.monture.prixVente * (1 - this.f.remiseMonture.value/100) * this.f.qteMonture.value);

    }
    else{
      this.f.montantMonture.setValue(0);
      this.f.totalMonture.setValue(0);
    }

    if(this.lentilleG != null) {
      this.f.montantLentilleG.setValue(this.lentilleG.prixVente * (1 - this.f.remiseLentilleG.value/100));
      this.f.totalLentilleG.setValue(this.lentilleG.prixVente * (1 - this.f.remiseLentilleG.value/100) * this.f.qteLentilleG.value);
    }
    else{
      this.f.montantLentilleG.setValue(0);
      this.f.totalLentilleG.setValue(0);
    }

    if(this.lentilleD != null) {
      this.f.montantLentilleD.setValue(this.lentilleD.prixVente * (1 - this.f.remiseLentilleD.value/100));
      this.f.totalLentilleD.setValue(this.lentilleD.prixVente * (1 - this.f.remiseLentilleD.value/100) * this.f.qteLentilleD.value);
    }
    else{
      this.f.montantLentilleD.setValue(0);
      this.f.totalLentilleD.setValue(0);
    }

    if(this.couverture.length ==1){
      this.f.priseEnCharge.setValue(this.f.totalMonture.value * this.couverture.at(0).get('couvertureMonture').value/100 + this.f.totalLentilleG.value * this.couverture.at(0).get('couvertureVerre').value/100 + this.f.totalLentilleG.value*this.couverture.at(0).get('couvertureVerre').value/100);
      this.f.franchise.setValue((this.f.totalMonture.value + this.f.totalLentilleG.value + this.f.totalLentilleD.value) - this.f.priseEnCharge.value);
      this.aPayer = (this.f.totalMonture.value + this.f.totalLentilleG.value + this.f.totalLentilleD.value) - this.f.priseEnCharge.value;
    }
    else {
      this.f.priseEnCharge.setValue(0);
      this.f.franchise.setValue(0);
      this.aPayer = (this.f.totalMonture.value + this.f.totalLentilleG.value + this.f.totalLentilleD.value);
    }



  }

  formatMillier( nombre){
    nombre += '';
    var sep = ' ';
    var reg = /(\d+)(\d{3})/;
    while( reg.test( nombre)) {
      nombre = nombre.replace( reg, '$1' +sep +'$2');
    }
    return nombre;
  }

  onReset() {
    this.submitted = false;
    this.factureForm.reset();
    this.patient = null;
    this.onEnablePatientForm();
    this.onEnableAssurePrincipalForm();

  }
  onResettMontureForm() {
    this.submittedMontureForm = false;
    this.montureForm.reset();
  }
  onResettLentilleDForm() {
    this.submittedLentilleDForm = false;
    this.lentilleDForm.reset();
  }
  onResettLentilleGForm() {
    this.submittedLentilleGForm = false;
    this.lentilleGForm.reset();
  }

  onSubmitForm() {
    console.log("onSubmitForm");
    this.submitted = true;
    if (this.factureForm.invalid) {
      console.log("factureForm.invalid");
      return;
    }

     const formValue = this.factureForm.value;


    /*
           let editedFacture = new FactureClientModel();


           if(this.patient){
             editedFacture.patient = this.patient;
           }
           else {
             let editedPatient = new PersonneModel();
             editedPatient.civilite = formValue['civilitePatient'] ? (<string> formValue['civilitePatient']).trim() : formValue['civilitePatient'];
             editedPatient.nom = formValue['nomPatient'] ? (<string> formValue['nomPatient']).trim() : formValue['nomPatient'];
             editedPatient.prenom = formValue['prenomPatient'] ? (<string> formValue['prenomPatient']).trim() : formValue['prenomPatient'];
             editedPatient.dateNaiss = formValue['dateNaissPatient'] ? (<string> formValue['dateNaissPatient']).trim() : formValue['dateNaissPatient'];
             editedPatient.email = formValue['emailPatient'] ? (<string> formValue['emailPatient']).trim() : formValue['emailPatient'];
             editedPatient.adresse = formValue['adressePatient'] ? (<string> formValue['adressePatient']).trim() : formValue['adressePatient'];
             editedPatient.tel1 = formValue['tel1Patient'] ? (<string> formValue['tel1Patient']).trim() : formValue['tel1Patient'];
             editedPatient.tel2 = formValue['tel2Patient'] ? (<string> formValue['tel2Patient']).trim() : formValue['tel2Patient'];
             if(formValue['idEntreprisePatient']){
               editedPatient.entreprise = this.listEntreprises.filter(entre => entre.id == formValue['idEntreprisePatient'])[0];
             }
             else {
               editedPatient.entreprise = null;
             }
             editedFacture.patient = editedPatient;
           }

           if(this.prescription.length == 1){
             let editedPrescription = new PrescriptionModel(null, null, null, null);
             editedPrescription.datePrescription = this.prescription.at(0).get('datePrescription').value;
             editedPrescription.deadline = this.prescription.at(0).get('dateLimite').value;
             editedPrescription.eyeVision = this.prescription.at(0).get('eyeVision').value;
             editedPrescription.port = this.prescription.at(0).get('port').value;
             if(this.prescripteur){
               editedPrescription.prescripteur = this.prescripteur;
             }
             else {
               let editedPrescripteur = new PrescripteurModel();
               editedPrescripteur.nom =  this.prescription.at(0).get('nomPrescripteur').value;
               editedPrescription.prescripteur = editedPrescripteur;
             }
             editedFacture.prescription = editedPrescription;
           }
            */

    let isVente = false;
    if(this.monture && formValue['qteMonture'] >= 1){
      if(formValue['qteMonture'] > this.monture.qte){
        alert("La quantité de monture "+this.monture.produit.libelle+" en stock est inférieur à la quantité commandé");
        return;
      }
      else
        isVente = true;
    }
    if(this.lentilleD && formValue['qteLentilleD'] >= 1){
      if(formValue['qteLentilleD'] > this.lentilleD.qte){
        alert("La quantité de lentille "+this.lentilleD.produit.libelle+" en stock est inférieur à la quantité commandé");
        return;
      }
      else
        isVente = true;
    }
    if(this.lentilleG && formValue['qteLentilleG'] >= 1){
      if(formValue['qteLentilleG'] > this.lentilleG.qte){
        alert("La quantité de lentille "+this.lentilleG.produit.libelle+" en stock est inférieur à la quantité commandé");
        return;
      }
      else
        isVente = true;
    }
    if(isVente == false){
      alert("Veillez selectionner au moin un produit");
      return;
    }

    /*
    if(this.couverture.length == 1){
      let editedCouverture : CouvertureModel[]=[];
      let editCouverture = new CouvertureModel(null, null, null, null, null, null)

      if(this.assurePrincipal){
        editCouverture.assurePrincipal = this.assurePrincipal;
      }
      else {
        let editedAssurePrincipal = new PersonneModel();
        editedAssurePrincipal.civilite = this.couverture.at(0).get('civiliteAssurePrincipal').value;
        editedAssurePrincipal.nom = this.couverture.at(0).get('nomAssurePrincipal').value ? (<string>formValue2['nomAssurePrincipal']).trim() : formValue2['nomAssurePrincipal'];
        editedAssurePrincipal.prenom = this.couverture.at(0).get('prenomAssurePrincipal').value ? (<string>formValue2['prenomAssurePrincipal']).trim() : formValue2['prenomAssurePrincipal'];
        editedAssurePrincipal.dateNaiss = this.couverture.at(0).get('dateNaissAssurePrincipal').value ? (<string>formValue2['dateNaissAssurePrincipal']).trim() : formValue2['dateNaissAssurePrincipal'];
        editedAssurePrincipal.email = this.couverture.at(0).get('emailAssurePrincipal').value ? (<string>formValue2['emailAssurePrincipal']).trim() : formValue2['emailAssurePrincipal'];
        editedAssurePrincipal.adresse = this.couverture.at(0).get('adresseAssurePrincipal').value ? (<string>formValue2['adresseAssurePrincipal']).trim() : formValue2['adresseAssurePrincipal'];
        editedAssurePrincipal.tel1 = this.couverture.at(0).get('tel1AssurePrincipal').value ? (<string>formValue2['tel1AssurePrincipal']).trim() : formValue2['tel1AssurePrincipal'];
        editCouverture.assurePrincipal = editedAssurePrincipal;
      }
      editCouverture.couvertureVerre = formValue2['couvertureVerre'];
      editCouverture.couvertureMonture = formValue2['couvertureMonture'];
      editCouverture.dateDocument = formValue2['dateDocument'];
      editCouverture.numeroDocument = formValue2['numeroDocument'];
      editCouverture.priseEnCharge = formValue['priseEnCharge'];
      editCouverture.franchise = formValue['franchise'];
      editCouverture.relation = formValue2['relation'];
      if(this.entreprise){
        editCouverture.entreprise = this.entreprise;
      }
      else {
        let editedEntreprise = new CompagniModel();
        editedEntreprise.nom = formValue2['entrepriseAssurePrincipal'] ? (<string> formValue2['entrepriseAssurePrincipal']).trim() : formValue2['entrepriseAssurePrincipal'];
        editCouverture.entreprise = editedEntreprise;
      }
      if(this.assurance){
        editCouverture.assurance = this.assurance;
      }
      else {
        let editedAssurance = new CompagniModel();
        editedAssurance.nom = formValue2['assurance'] ? (<string> formValue2['assurance']).trim() : formValue2['assurance'];
        editCouverture.assurance = editedAssurance;
      }

      editedCouverture.push(editCouverture);
      editedFacture.couvertures = editedCouverture;
    }
     */

    this.addFactureClient(this.loadFacture());

  }
  onSubmitMontureForm() {
    this.submittedMontureForm = true;
    if (this.montureForm.invalid) {
      return;
    }

    const formValue = this.montureForm.value;
    let editedStock = new StockModel(null, null,null,null);
    let editedMonture = new MontureModel(null,null,null,null,null);
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

    this.addMonture(editedStock);
  }
  onSubmitLentilleGForm(){
    this.submittedLentilleGForm = true;
    if (this.lentilleGForm.invalid) {
      return;
    }
    const formValue = this.lentilleGForm.value;
    let editedStock = new StockModel(null, null,null,null);
    let editedLentille = new LentilleModel(null, null);
    editedLentille.sphere = <number> formValue['sphere'];
    editedLentille.cylindre = <number> formValue['cylindre'];
    editedLentille.axe = <number> formValue['axe'];
    editedLentille.addition = <number> formValue['addition'];
    editedLentille.libelle = (<string> formValue['libelle']).trim();
    editedStock.produit = editedLentille;
    editedStock.prixVente = formValue['prixVente'];
    editedStock.qte = formValue['qte'];

      this.addLentille(editedStock, 'G');
  }
  onSubmitLentilleDForm(){
    this.submittedLentilleDForm = true;
    if (this.lentilleDForm.invalid) {
      return;
    }
    const formValue = this.lentilleDForm.value;
    let editedStock = new StockModel(null, null,null,null);
    let editedLentille = new LentilleModel(null, null);
    editedLentille.sphere = <number> formValue['sphere'];
    editedLentille.cylindre = <number> formValue['cylindre'];
    editedLentille.axe = <number> formValue['axe'];
    editedLentille.addition = <number> formValue['addition'];
    editedLentille.libelle = (<string> formValue['libelle']).trim();
    editedStock.produit = editedLentille;
    editedStock.prixVente = formValue['prixVente'];
    editedStock.qte = formValue['qte'];

    this.addLentille(editedStock, 'D');
  }
  private addMonture(stock : StockModel) {
    this.montureService.addMonture(stock.produit as MontureModel).subscribe(data1=>{
      stock.produit = data1 as MontureModel;
      this.stockService.addStock(stock).subscribe(data2=>{
        this.stockService.getAllStocks();
        this.monture = data2 as StockModel;
        console.log(this.monture.produit.libelle);
        this.montureControl.setValue(this.monture);
        this.onCalculValeurs();
        this.onResettMontureForm();
        document.getElementById('montureModal').click();
      }, error => {
        console.log('Error ! : ' + error);
      });
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });

  }
  private addLentille(stock : StockModel, cote : string) {
    this.lentilleService.addLentille(stock.produit as LentilleModel).subscribe(data1=>{
      stock.produit = data1 as LentilleModel;
      this.stockService.addStock(stock).subscribe(data2=>{
        this.stockService.getAllStocks();
        if(cote == 'G'){
          this.lentilleG = data2 as StockModel;
          this.lentilleGControl.setValue(this.lentilleG);
          this.onCalculValeurs();
          this.onResettLentilleGForm();
          document.getElementById('lentilleGModal').click();
        }
        if(cote == 'D'){
          this.lentilleD = data2 as StockModel;
          this.lentilleDControl.setValue(this.lentilleD);
          this.onCalculValeurs();
          this.onResettLentilleDForm();
          document.getElementById('lentilleDModal').click();
        }
      }, error => {
        console.log('Error ! : ' + error);
      });
    }, error => {
      console.log('Error ! : ' + error);
      this.loading = false;
    });

  }

  loadFacture(){

    const formValue = this.factureForm.value;


    let editedFacture = new FactureClientModel();

    if(this.patient){
      editedFacture.patient = this.patient;
    }
    else {
      let editedPatient = new PersonneModel();
      editedPatient.civilite = formValue['civilitePatient'] ? (<string> formValue['civilitePatient']).trim() : formValue['civilitePatient'];
      editedPatient.nom = formValue['nomPatient'] ? (<string> formValue['nomPatient']).trim() : formValue['nomPatient'];
      editedPatient.prenom = formValue['prenomPatient'] ? (<string> formValue['prenomPatient']).trim() : formValue['prenomPatient'];
      editedPatient.dateNaiss = formValue['dateNaissPatient'] ? (<string> formValue['dateNaissPatient']).trim() : formValue['dateNaissPatient'];
      editedPatient.email = formValue['emailPatient'] ? (<string> formValue['emailPatient']).trim() : formValue['emailPatient'];
      editedPatient.adresse = formValue['adressePatient'] ? (<string> formValue['adressePatient']).trim() : formValue['adressePatient'];
      editedPatient.tel1 = formValue['tel1Patient'] ? (<string> formValue['tel1Patient']).trim() : formValue['tel1Patient'];
      editedPatient.tel2 = formValue['tel2Patient'] ? (<string> formValue['tel2Patient']).trim() : formValue['tel2Patient'];
      if(formValue['idEntreprisePatient']){
        editedPatient.entreprise = this.listEntreprises.filter(entre => entre.id == formValue['idEntreprisePatient'])[0];
      }
      else {
        editedPatient.entreprise = null;
      }
      editedFacture.patient = editedPatient;
    }

    if(this.prescription.length == 1){
      let editedPrescription = new PrescriptionModel(null, null, null, null);
      editedPrescription.datePrescription = this.prescription.at(0).get('datePrescription').value;
      editedPrescription.deadline = this.prescription.at(0).get('dateLimite').value;
      editedPrescription.eyeVision = this.prescription.at(0).get('eyeVision').value;
      editedPrescription.port = this.prescription.at(0).get('port').value;
      if(this.prescripteur){
        editedPrescription.prescripteur = this.prescripteur;
      }
      else {
        let editedPrescripteur = new PrescripteurModel();
        editedPrescripteur.nom =  this.prescription.at(0).get('nomPrescripteur').value;
        editedPrescription.prescripteur = editedPrescripteur;
      }
      editedFacture.prescription = editedPrescription;
    }

    let editedVente : VenteModel[]=[];
    if(this.monture && formValue['qteMonture'] >= 1){
      if(formValue['qteMonture'] > this.monture.qte){
        alert("La quantité de monture "+this.monture.produit.libelle+" en stock est inférieur à la quantité commandé");
        return;
      }
      let vente1 = new VenteModel(this.monture.prixVente, formValue['qteMonture'], formValue['montantMonture'], formValue['remiseMonture'], formValue['totalMonture']);
      vente1.stock = this.monture;
      vente1.libelle = "monture";
      editedVente.push(vente1);
    }
    if(this.lentilleD && formValue['qteLentilleD'] >= 1){
      if(formValue['qteLentilleD'] > this.lentilleD.qte){
        alert("La quantité de lentille "+this.lentilleD.produit.libelle+" en stock est inférieur à la quantité commandé");
        return;
      }
      let vente2 = new VenteModel(this.lentilleD.prixVente, formValue['qteLentilleD'], formValue['montantLentilleD'], formValue['remiseLentilleD'], formValue['totalLentilleD']);
      vente2.stock = this.lentilleD;
      vente2.libelle = "lentilleD";
      editedVente.push(vente2);
    }
    if(this.lentilleG && formValue['qteLentilleG'] >= 1){
      if(formValue['qteLentilleG'] > this.lentilleG.qte){
        alert("La quantité de lentille "+this.lentilleG.produit.libelle+" en stock est inférieur à la quantité commandé");
        return;
      }
      let vente3 = new VenteModel(this.lentilleG.prixVente, formValue['qteLentilleG'], formValue['montantLentilleG'], formValue['remiseLentilleG'], formValue['totalLentilleG']);
      vente3.stock = this.lentilleG;
      vente3.libelle = "lentilleG";
      editedVente.push(vente3);
    }
    if(editedVente.length < 1){
      alert("Veillez selectionner au moin un produit");
      return;
    }
    editedFacture.ventes = editedVente;

    if(this.couverture.length == 1){
      const formValue2 = this.couverture.at(0).value;
      let editedCouverture : CouvertureModel[]=[];
      let editCouverture = new CouvertureModel(null, null, null, null, null, null)

      if(this.assurePrincipal){
        editCouverture.assurePrincipal = this.assurePrincipal;
      }
      else {
        let editedAssurePrincipal = new PersonneModel();
        editedAssurePrincipal.civilite = this.couverture.at(0).get('civiliteAssurePrincipal').value;
        editedAssurePrincipal.nom = this.couverture.at(0).get('nomAssurePrincipal').value ? (<string>formValue2['nomAssurePrincipal']).trim() : formValue2['nomAssurePrincipal'];
        editedAssurePrincipal.prenom = this.couverture.at(0).get('prenomAssurePrincipal').value ? (<string>formValue2['prenomAssurePrincipal']).trim() : formValue2['prenomAssurePrincipal'];
        editedAssurePrincipal.dateNaiss = this.couverture.at(0).get('dateNaissAssurePrincipal').value ? (<string>formValue2['dateNaissAssurePrincipal']).trim() : formValue2['dateNaissAssurePrincipal'];
        editedAssurePrincipal.email = this.couverture.at(0).get('emailAssurePrincipal').value ? (<string>formValue2['emailAssurePrincipal']).trim() : formValue2['emailAssurePrincipal'];
        editedAssurePrincipal.adresse = this.couverture.at(0).get('adresseAssurePrincipal').value ? (<string>formValue2['adresseAssurePrincipal']).trim() : formValue2['adresseAssurePrincipal'];
        editedAssurePrincipal.tel1 = this.couverture.at(0).get('tel1AssurePrincipal').value ? (<string>formValue2['tel1AssurePrincipal']).trim() : formValue2['tel1AssurePrincipal'];
        editCouverture.assurePrincipal = editedAssurePrincipal;
      }
      editCouverture.couvertureVerre = formValue2['couvertureVerre'];
      editCouverture.couvertureMonture = formValue2['couvertureMonture'];
      editCouverture.dateDocument = formValue2['dateDocument'];
      editCouverture.numeroDocument = formValue2['numeroDocument'];
      editCouverture.priseEnCharge = formValue['priseEnCharge'];
      editCouverture.franchise = formValue['franchise'];
      editCouverture.relation = formValue2['relation'];
      if(this.entreprise){
        editCouverture.entreprise = this.entreprise;
      }
      else {
        let editedEntreprise = new CompagniModel();
        editedEntreprise.nom = formValue2['entrepriseAssurePrincipal'] ? (<string> formValue2['entrepriseAssurePrincipal']).trim() : formValue2['entrepriseAssurePrincipal'];
        editCouverture.entreprise = editedEntreprise;
      }
      if(this.assurance){
        editCouverture.assurance = this.assurance;
      }
      else {
        let editedAssurance = new CompagniModel();
        editedAssurance.nom = formValue2['assurance'] ? (<string> formValue2['assurance']).trim() : formValue2['assurance'];
        editedAssurance.type = 'assurance';
        editCouverture.assurance = editedAssurance;
      }

      editedCouverture.push(editCouverture);
      editedFacture.couvertures = editedCouverture;
    }

    return editedFacture;
  }

  private addFactureClient(facture : FactureModel) {
    console.log(facture);
    this.factureClientService.addFactureClient(facture).subscribe(
      data =>{
        console.log(data);
        // @ts-ignore
        this.router.navigate(['/print-facture-client/'+data.id]);
      }, error => {
        console.log('Error ! : ' + error);
        //this.loading = false;
      }
    )
  }

}


