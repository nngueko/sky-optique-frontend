import {Component, OnInit, ViewChild} from '@angular/core';
import {MontureModel} from "../models/monture.model";
import {LentilleModel} from "../models/lentille.model";
import {PrescriptionModel} from "../models/prescription.model";
import {VenteModel} from "../models/vente.model";
import {PersonneModel} from "../models/personne.model";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {ActivatedRoute, Router} from "@angular/router";
import {FactureService} from "../services/facture.service";
import {CompagniService} from "../services/compagni.service";
import {PersonneService} from "../services/personne.service";
import {ProformaService} from "../services/proforma.service";
import {CompagniModel} from "../models/compagni.model";
import {map, startWith} from "rxjs/operators";
import {StockModel} from "../models/stockModel";
import {StockService} from "../services/stock.service";
import {FournisseurModel} from "../models/fournisseur.model";
import {ProformaModel} from "../models/Proforma.model";
import {LivraisonModel} from "../models/livraison.model";
import {FactureModel} from "../models/facture.model";

@Component({
  selector: 'app-add-proforma',
  templateUrl: './add-proforma.component.html',
  styleUrls: ['./add-proforma.component.css']
})
export class AddProformaComponent implements OnInit {

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

  prescription : PrescriptionModel;
  listVentes : VenteModel[];

  patient : PersonneModel = null;
  filteredPatients : Observable<PersonneModel[]>;
  listPatients : PersonneModel[]=[];
  listPersonnesSubscription : Subscription;
  patientTriggerSubscription : Subscription;
  @ViewChild('autoCompletePatient', { read: MatAutocompleteTrigger }) triggerPatient: MatAutocompleteTrigger;

  prescripteur : PersonneModel = null;
  filteredPrescripteurs : Observable<PersonneModel[]>;
  listPrescripteurs : PersonneModel[]=[];
  prescripteurTriggerSubscription : Subscription;
  @ViewChild('autoCompletePatient', { read: MatAutocompleteTrigger }) triggerPrescripteur: MatAutocompleteTrigger;


  listEntreprises : CompagniModel[]=[];
  listEntreprisesSubscription : Subscription;

  factureForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private proformaService : ProformaService,
              private compagniService : CompagniService,
              private personneService : PersonneService,
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
          this.factureForm.get('civilitePatient').enable();
          this.factureForm.get('idEntreprisePatient').enable();
          this.onInitPatientForm(new PersonneModel(null, null, null, null, null, new CompagniModel()));
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
  }
  getLentilleG(event) {
    this.lentilleG = event.option.value;
  }
  getLentilleD(event) {
    this.lentilleD = event.option.value;
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

    });
  }
  get f() { return this.factureForm.controls; }

  onReset() {
    this.submitted = false;
    this.factureForm.reset();
    this.patient = null;
    this.factureForm.get('civilitePatient').enable();
    this.factureForm.get('idEntreprisePatient').enable();
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
    let editedPrescription : PrescriptionModel = new PrescriptionModel(null, null, null, null);
    let editedVente : VenteModel[]=[];

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

    let editedFacture = new ProformaModel();
    editedFacture.patient = editedPatient;
    editedFacture.prescription = editedPrescription;
    editedFacture.ventes = editedVente;

    if(editedVente.length < 1){
      alert("Veillez selectionner au moin un produit");
      return;
    }

    console.log(editedFacture);

    this.addProformat(editedFacture);

  }
  private addProformat(facture : FactureModel) {
    console.log(facture);
    this.proformaService.addProforma(facture).subscribe(
      data =>{
        console.log(data);
        //this.bonLivraisonService.getAllBonLivraison();
        //this.router.navigate(['/bonLivraisons']);
      }, error => {
        console.log('Error ! : ' + error);
        //this.loading = false;
      }
    )
  }

}
