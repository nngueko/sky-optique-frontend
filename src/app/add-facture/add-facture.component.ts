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
import {ProformaModel} from "../models/Proforma.model";
import {FactureModel} from "../models/facture.model";
import {FactureClientModel} from "../models/factureClient.model";
import {CouvertureModel} from "../models/couverture.model";

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
  lentilleD : StockModel;
  lentilleGControl = new FormControl();
  lentilleDControl = new FormControl();
  filteredLentilleG : Observable<StockModel[]>;
  filteredLentilleD : Observable<StockModel[]>;
  lentilleGTriggerSubscription : Subscription;
  lentilleDTriggerSubscription : Subscription;
  @ViewChild('autoCompleteLentilleG', { read: MatAutocompleteTrigger }) triggerLentilleG: MatAutocompleteTrigger;
  @ViewChild('autoCompleteLentilleD', { read: MatAutocompleteTrigger }) triggerLentilleD: MatAutocompleteTrigger;
  listLentilles : StockModel[]=[];

  isCouverture = true;

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
  prescripteurTriggerSubscription : Subscription;
  @ViewChild('autoCompletePrescripteur', { read: MatAutocompleteTrigger }) triggerPrescripteur: MatAutocompleteTrigger;

  listEntreprises : CompagniModel[]=[];
  listEntreprisesSubscription : Subscription;

  factureForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private factureService : FactureService,
              private compagniService : CompagniService,
              private personneService : PersonneService,
              private factureClientService : FactureClientService,
              private stockService : StockService
              ) { }

  ngOnInit(): void {
    this.initForm();
    //this.onAddCouverture();

    this.listEntreprisesSubscription = this.compagniService.listCompagniSubject.subscribe(
      data => {
        this.listEntreprises = data;
      }, error => {
        console.log('Error ! : ' + error);
      }
    );
    this.compagniService.getAllCompagnis();

    this.listPersonnesSubscription = this.personneService.listPersonneSubject.subscribe(
      data => {
        this.listPatients = data;
        this.listPrescripteurs = this.listPatients.filter(pers => pers.isPrescripteur == true);
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
    this.filteredAssurePrincipals = this.factureForm.get('nomAssurePrincipal').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : ''),
      map(nom => nom ? this._filterPatient(nom) : this.listPatients.slice())
    );
    this.filteredPrescripteurs = this.factureForm.get('nomPrescripteur').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : ''),
      map(nom => nom ? this._filterPrescripteur(nom) : this.listPrescripteurs.slice())
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
    this.stockService.getAllStocksByQte(1);
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
  }

  ngAfterViewInit() {
    this.patientTriggerSubscription = this.triggerPatient.panelClosingActions.subscribe(e => {
      if (!e) {
        if(this.patient != null){
          this.patient = null;
          this.onInitPatientForm(new PersonneModel(null, null, null, null, null, new CompagniModel()));
          this.onEnablePatientForm();
        }
      }
    },e => console.log('error', e));

    this.assurePrincipalTriggerSubscription = this.triggerAssurePrincipal.panelClosingActions.subscribe(e => {
      if (!e) {
        if(this.assurePrincipal != null){
          this.assurePrincipal = null;
          this.onInitAssurePrincipalForm(new PersonneModel(null, null, null, null, null, new CompagniModel()));
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

    this.montureTriggerSubscription = this.triggerMonture.panelClosingActions.subscribe(e => {
      if (!e) {
        this.monture = null;
        this.montureControl.setValue(new MontureModel(null,null,null,null, null, null));
        this.factureForm.get('qteMonture').reset(1);
        this.factureForm.get('remiseMonture').reset(0);
      }
    },e => console.log('error', e));

    this.lentilleGTriggerSubscription = this.triggerLentilleG.panelClosingActions.subscribe(e => {
      if (!e) {
        this.lentilleG = null;
        this.lentilleGControl.setValue(new LentilleModel(null,null,null,null));
        this.factureForm.get('qteLentilleG').reset(1);
        this.factureForm.get('remiseLentilleG').reset(0);
      }
    },e => console.log('error', e));
    this.lentilleDTriggerSubscription = this.triggerLentilleD.panelClosingActions.subscribe(e => {
      if (!e) {
        this.lentilleD = null;
        this.lentilleDControl.setValue(new LentilleModel(null,null,null,null));
        this.factureForm.get('qteLentilleD').reset(1);
        this.factureForm.get('remiseLentilleD').reset(0);
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
    this.factureForm.get('civilitePatient').disable();
    this.factureForm.get('idEntreprisePatient').disable();
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

  getAssurePrincipal(event) {
    this.assurePrincipal = event.option.value;
    this.onInitAssurePrincipalForm(this.assurePrincipal);
    this.factureForm.get('civilitePatient').disable();
    this.factureForm.get('idEntreprisePatient').disable();
  }
  onInitAssurePrincipalForm(patient: PersonneModel){
    //this.factureForm.get('nom').setValue(patient.nom);
    this.factureForm.get('prenomAssurePrincipal').setValue(patient.prenom);
    this.factureForm.get('dateNaissAssurePrincipal').setValue(patient.dateNaiss);
    this.factureForm.get('adresseAssurePrincipal').setValue(patient.adresse);
    this.factureForm.get('emailAssurePrincipal').setValue(patient.email);
    this.factureForm.get('tel1AssurePrincipal').setValue(patient.tel1);
    this.factureForm.get('civiliteAssurePrincipal').setValue(patient.civilite);
    this.factureForm.get('entrepriseAssurePrincipal').setValue(patient.entreprise ? patient.entreprise.id : null);
    if(patient.id == null)
      this.onEnableAssurePrincipalForm();
    else
      this.onDisableAssurePrincipalForm();
  }
  onDisableAssurePrincipalForm(){
    this.factureForm.get('prenomAssurePrincipal').disable();
    this.factureForm.get('dateNaissAssurePrincipal').disable();
    this.factureForm.get('adresseAssurePrincipal').disable();
    this.factureForm.get('emailAssurePrincipal').disable();
    this.factureForm.get('tel1AssurePrincipal').disable();
    this.factureForm.get('civiliteAssurePrincipal').disable();
    this.factureForm.get('entrepriseAssurePrincipal').disable();
  }
  onEnableAssurePrincipalForm(){
    this.factureForm.get('prenomAssurePrincipal').enable();
    this.factureForm.get('dateNaissAssurePrincipal').enable();
    this.factureForm.get('adresseAssurePrincipal').enable();
    this.factureForm.get('emailAssurePrincipal').enable();
    this.factureForm.get('tel1AssurePrincipal').enable();
    this.factureForm.get('civiliteAssurePrincipal').enable();
    this.factureForm.get('entrepriseAssurePrincipal').enable();
  }

  private _filterPrescripteur(value: string): PersonneModel[] {
    const filterValue = value.toLowerCase();
    let val='';
    return this.listPrescripteurs.filter(option => {
      let val='';
      if(option.titre != null)
        val = val+option.titre+' ';
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
      if(prescripteur.titre != null)
        val = val+prescripteur.titre+' ';
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
    this.onCalculValeurs();
  }
  getLentilleD(event) {
    this.lentilleD = event.option.value;
    this.onCalculValeurs();
  }

  initForm(){
    this.factureForm = this.formBuilder.group({
      civilitePatient: [null, Validators.compose([Validators.required])],
      nomPatient: [null, Validators.compose([Validators.required])],
      prenomPatient: new FormControl(),
      dateNaissPatient: new FormControl(),
      emailPatient: [null, Validators.compose([Validators.email])],
      adressePatient: new FormControl(),
      tel1Patient: new FormControl(),
      tel2Patient: new FormControl(),
      idEntreprisePatient: new FormControl(),

      nomPrescripteur: ['', Validators.compose([Validators.required])],
      prenomPrescripteur: new FormControl(),
      titre: new FormControl(),
      datePrescription: new FormControl(),
      dateLimite: new FormControl(),
      eyeVision: new FormControl(),
      port: new FormControl(),

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

      civiliteAssurePrincipal: [null, Validators.compose([Validators.required])],
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
      priseEnCharge : 0,
      franchise : 0,
      relation : '',

    });
  }
  get f() { return this.factureForm.controls; }

  onAddCouverture(){
    this.isCouverture = true;
    this.onCalculValeurs();
  }
  onDeleteCouverture(){
    this.isCouverture = false;
    this.onInitAssurePrincipalForm(new PersonneModel(null, null, null, null, null, new CompagniModel()));
    this.factureForm.get('nomAssurePrincipal').reset();
    this.factureForm.get('assurance').reset();
    this.factureForm.get('couvertureVerre').reset();
    this.factureForm.get('couvertureMonture').reset();
    this.factureForm.get('numeroDocument').reset();
    this.factureForm.get('dateDocument').reset();
    this.factureForm.get('priseEnCharge').reset();
    this.factureForm.get('relation').reset();
    this.factureForm.get('franchise').reset();
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

    if(this.isCouverture){
      this.f.priseEnCharge.setValue(this.f.totalMonture.value * this.f.couvertureMonture.value/100 + this.f.totalLentilleG.value * this.f.couvertureVerre.value/100 + this.f.totalLentilleG.value*this.f.couvertureVerre.value/100)
      this.f.franchise.setValue((this.f.totalMonture.value + this.f.totalLentilleG.value + this.f.totalLentilleD.value) - this.f.priseEnCharge.value);
      this.aPayer = (this.f.totalMonture.value + this.f.totalLentilleG.value + this.f.totalLentilleD.value) - this.f.priseEnCharge.value;
    }
    else {
      this.f.priseEnCharge.setValue(0);
      this.f.franchise.setValue(0);
      this.aPayer = (this.f.totalMonture.value + this.f.totalLentilleG.value + this.f.totalLentilleD.value);
    }



  }

  onReset() {
    this.submitted = false;
    this.factureForm.reset();
    this.patient = null;
    this.onEnablePatientForm();
    this.onEnableAssurePrincipalForm();

  }

  onSubmitForm() {
    console.log("onSubmitForm");

    this.submitted = true;
    if (this.factureForm.invalid) {
      console.log("factureForm.invalid");
      return;
    }

    const formValue = this.factureForm.value;
    let editedPatient = new PersonneModel();
    let editedAssurePrincipal = new PersonneModel();
    let editedPrescription : PrescriptionModel = new PrescriptionModel(null, null, null, null);
    let editedVente : VenteModel[]=[];
    let editedCouverture : CouvertureModel[]=[];

    if(this.patient){
      editedPatient  = this.patient;
    }
    else {
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
    }

    if(this.prescripteur || formValue['nomPrescripteur']){
      editedPrescription.datePrescription = formValue['datePrescription'] ? (<string> formValue['datePrescription']).trim() : formValue['datePrescription'];
      editedPrescription.deadline = formValue['datePrescription'] ? (<string> formValue['datePrescription']).trim() : formValue['datePrescription'];
      editedPrescription.eyeVision = formValue['datePrescription'] ? (<string> formValue['datePrescription']).trim() : formValue['datePrescription'];
      editedPrescription.port = formValue['datePrescription'] ? (<string> formValue['datePrescription']).trim() : formValue['datePrescription'];
      if(this.prescripteur){
        editedPrescription.prescripteur = this.prescripteur;
      }
      else {
        let editedPrescripteur = new PersonneModel();
        editedPrescripteur.nom = formValue['nomPrescripteur'] ? (<string> formValue['nomPrescripteur']).trim() : formValue['nomPrescripteur'];
        editedPrescripteur.prenom = formValue['prenomPrescripteur'] ? (<string> formValue['prenomPrescripteur']).trim() : formValue['prenomPrescripteur'];
        editedPrescripteur.titre = formValue['titre'] ? (<string> formValue['titre']).trim() : formValue['titre'];
        editedPrescripteur.isPrescripteur = true;
        editedPrescription.prescripteur = editedPrescripteur;
      }
    }
    else {
      editedPrescription = null;
    }

    if(this.monture && formValue['qteMonture'] >= 1){
      let vente1 = new VenteModel(this.monture.prixVente, formValue['qteMonture'], formValue['montantMonture'], formValue['remiseMonture'], formValue['totalMonture']);
      vente1.produit = this.monture.produit;
      editedVente.push(vente1);
    }
    if(this.lentilleD && formValue['qteLentilleD'] >= 1){
      let vente2 = new VenteModel(this.lentilleD.prixVente, formValue['qteLentilleD'], formValue['montantLentilleD'], formValue['remiseLentilleD'], formValue['totalLentilleD']);
      vente2.produit = this.lentilleD.produit;
      editedVente.push(vente2);
    }
    if(this.lentilleG && formValue['qteLentilleG'] >= 1){
      let vente3 = new VenteModel(this.lentilleG.prixVente, formValue['qteLentilleG'], formValue['montantLentilleG'], formValue['remiseLentilleG'], formValue['totalLentilleG']);
      vente3.produit = this.lentilleG.produit;
      editedVente.push(vente3);
    }

    if(this.isCouverture){
      if(this.assurePrincipal){
        editedAssurePrincipal  = this.assurePrincipal;
      }
      else {
        editedAssurePrincipal.civilite = formValue['civilitePatient'] ? (<string>formValue['civilitePatient']).trim() : formValue['civilitePatient'];
        editedAssurePrincipal.nom = formValue['nomPatient'] ? (<string>formValue['nomPatient']).trim() : formValue['nomPatient'];
        editedAssurePrincipal.prenom = formValue['prenomPatient'] ? (<string>formValue['prenomPatient']).trim() : formValue['prenomPatient'];
        editedAssurePrincipal.dateNaiss = formValue['dateNaissPatient'] ? (<string>formValue['dateNaissPatient']).trim() : formValue['dateNaissPatient'];
        editedAssurePrincipal.email = formValue['emailPatient'] ? (<string>formValue['emailPatient']).trim() : formValue['emailPatient'];
        editedAssurePrincipal.adresse = formValue['adressePatient'] ? (<string>formValue['adressePatient']).trim() : formValue['adressePatient'];
        editedAssurePrincipal.tel1 = formValue['tel1Patient'] ? (<string>formValue['tel1Patient']).trim() : formValue['tel1Patient'];
        if (formValue['entrepriseAssurePrincipal']) {
          editedAssurePrincipal.entreprise = this.listEntreprises.filter(entre => entre.id == formValue['entrepriseAssurePrincipal'])[0];
        } else {
          editedAssurePrincipal.entreprise = null;
        }
      }

      let editCouverture = new CouvertureModel(null, null, null, null, null, null)
      editCouverture.couvertureVerre = formValue['couvertureVerre'];
      editCouverture.couvertureMonture = formValue['couvertureMonture'];
      editCouverture.dateDocument = formValue['dateDocument'];
      editCouverture.numeroDocument = formValue['numeroDocument'];
      editCouverture.priseEnCharge = formValue['priseEnCharge'];
      editCouverture.franchise = formValue['franchise'];
      editCouverture.relation = formValue['relation'];
      editCouverture.assurance = this.listEntreprises.filter(entre => entre.id == formValue['assurance'])[0];
      editCouverture.assurePrincipal = editedAssurePrincipal;

      editedCouverture.push(editCouverture);

    }

    let editedFacture = new FactureClientModel();
    editedFacture.patient = editedPatient;
    editedFacture.prescription = editedPrescription;
    editedFacture.ventes = editedVente;
    editedFacture.couvertures = editedCouverture;

    if(editedVente.length < 1){
      alert("Veillez selectionner au moin un produit");
      return;
    }

    console.log(editedFacture);

    this.addFactureClient(editedFacture);

  }
  private addFactureClient(facture : FactureModel) {
    console.log(facture);
    this.factureClientService.addFactureClient(facture).subscribe(
      data =>{
        console.log(data);
        this.onReset();
      }, error => {
        console.log('Error ! : ' + error);
        //this.loading = false;
      }
    )
  }

}


