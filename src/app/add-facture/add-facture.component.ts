import {Component, OnInit, ViewChild} from '@angular/core';
import {MontureModel} from "../models/monture.model";
import {LentilleModel} from "../models/lentille.model";
import {VenteModel} from "../models/vente.model";
import {PrescriptionModel} from "../models/prescription.model";
import {PersonneModel} from "../models/personne.model";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {LentilleService} from "../services/lentille.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FactureService} from "../services/facture.service";
import {FactureModel} from "../models/facture.model";
import {CompagniModel} from "../models/compagni.model";
import {CompagniService} from "../services/compagni.service";
import {Observable, Subscription} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {PersonneService} from "../services/personne.service";

@Component({
  selector: 'app-add-facture',
  templateUrl: './add-facture.component.html',
  styleUrls: ['./add-facture.component.css']
})
export class AddFactureComponent implements OnInit {

  monture : MontureModel;
  lentilleG : LentilleModel;
  lentilleD : LentilleModel;
  prescription : PrescriptionModel;
  listVentes : VenteModel[];

  entreprise : CompagniModel = null;
  entrepriseControl = new FormControl();
  filteredEntreprises : Observable<CompagniModel[]>;
  listEntreprises : CompagniModel[]=[];
  listEntreprisesSubscription : Subscription;
  entrepriseTriggerSubscription : Subscription;
  @ViewChild('autoCompleteEntreprise', { read: MatAutocompleteTrigger }) triggerEntreprise: MatAutocompleteTrigger;

  patient : PersonneModel = null;
  patientControl = new FormControl();
  filteredPatients : Observable<PersonneModel[]>;
  listPatients : PersonneModel[]=[];
  listPatientsSubscription : Subscription;
  patientTriggerSubscription : Subscription;
  @ViewChild('autoCompletePatient', { read: MatAutocompleteTrigger }) triggerPatient: MatAutocompleteTrigger;

  factureForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private factureService : FactureService,
              private compagniService : CompagniService,
              private personneService : PersonneService
              ) { }

  ngOnInit(): void {
    this.initForm();
    this.onAddCouverture();

    this.listEntreprisesSubscription = this.compagniService.listCompagniSubject.subscribe(
      data => {
        this.listEntreprises = data;
        this.entrepriseControl.setValue(new CompagniModel(null));
      }, error => {
        console.log('Error ! : ' + error);
      }
    );
    this.compagniService.getAllCompagnis();
    this.filteredEntreprises = this.entrepriseControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : ''),
      map(nom => nom ? this._filterEntreprise(nom) : this.listEntreprises.slice())
    );

    this.listPatientsSubscription = this.personneService.listPersonneSubject.subscribe(
      data => {
        this.listPatients = data;
        this.patientControl.setValue(new PersonneModel());
      }, error => {
        console.log('Error ! : ' + error);
      }
    );
    this.personneService.getAllPersonnes();
    this.filteredPatients = this.patientControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.nom),
      map(nom => nom ? this._filterPatient(nom) : this.listPatients.slice())
    );

  }
  ngOnDestroy(): void {
    this.listEntreprisesSubscription.unsubscribe();
    this.listPatientsSubscription.unsubscribe();
    this.patientTriggerSubscription.unsubscribe();
    this.entrepriseTriggerSubscription.unsubscribe();
  }
  ngAfterViewInit() {
    this.entrepriseTriggerSubscription = this.triggerEntreprise.panelClosingActions.subscribe(e => {
      if (!e) {
        this.entreprise = null;
        //this.entrepriseControl.setValue(new CompagniModel(null));
      }
    },e => console.log('error', e));

    this.patientTriggerSubscription = this.triggerPatient.panelClosingActions.subscribe(e => {
      if (!e) {
        if(this.patient != null){
          this.patient = null;
          this.onInitPatientForm(new PersonneModel(null, null, null, new CompagniModel()));
        }
      }
    },e => console.log('error', e));

  }

  private _filterEntreprise(value: string): CompagniModel[] {
    const filterValue = value.toLowerCase();
    return this.listEntreprises.filter(option => option.nom.toLowerCase().includes(filterValue));
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








  initForm(){
    this.factureForm = this.formBuilder.group({
      //isNewPatient: 'new',
      civilite: ['', Validators.compose([Validators.required])],
      nom: ['', Validators.compose([Validators.required])],
      prenom: '',
      dateNaiss: '',
      entreprise: '',
      tel1: '',
      couvertures: new FormArray([]),
      ventes: new FormArray([
        this.formBuilder.group({
          statement : ['', Validators.required]
        })
      ]),
    });
  }
  get f() { return this.factureForm.controls; }

  get couvertures() { return this.f.couvertures as FormArray; }
  onAddCouverture(){
    this.couvertures.push(this.formBuilder.group({
      couvertureVerre : ['', Validators.compose([Validators.required, Validators.min(0)])],
      couvertureMonture : ['', Validators.compose([Validators.required, Validators.min(0)])],
      numeroDocument : '',
      dateDocument : '',
      priseEnCharge : '',
      franchise : '',
      assurance : ['', Validators.compose([Validators.required])],
      entreprise : ['', Validators.compose([Validators.required])],
      assurePrincipal : ['', Validators.compose([Validators.required])],
      relation : '',

    }));
  }
  onDeleteCouverture(index: number){
    this.couvertures.removeAt(index);
  }
  onInitPatientForm(patient: PersonneModel){
    //this.factureForm.get('nom').setValue(patient.nom);
    this.factureForm.get('prenom').setValue(patient.prenom);
    this.factureForm.get('dateNaiss').setValue(patient.dateNaiss);
    this.factureForm.get('tel1').setValue(patient.tel1);
    this.factureForm.get('civilite').setValue(patient.civilite);
    if(patient.entreprise != null)
      this.entrepriseControl.setValue(patient.entreprise.nom);
    else
      this.entrepriseControl.reset();
  }


  onSubmitForm() {

  }


}


