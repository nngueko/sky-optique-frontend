import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { ListProduitsComponent } from './list-produits/list-produits.component';
import { ListMonturesComponent } from './list-montures/list-montures.component';
import { ListLentillesComponent } from './list-lentilles/list-lentilles.component';
import { EditLentilleComponent } from './edit-lentille/edit-lentille.component';
import { EditMontureComponent } from './edit-monture/edit-monture.component';
import { ListLivraisonsComponent } from './list-livraisons/list-livraisons.component';
import { EditLivraisonComponent } from './edit-livraison/edit-livraison.component';
import { EditBonCommandeComponent } from './edit-bon-commande/edit-bon-commande.component';
import { ListBonCommandesComponent } from './list-bon-commandes/list-bon-commandes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {HttpClientModule} from "@angular/common/http";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { ListBonLivraisonsComponent } from './list-bon-livraisons/list-bon-livraisons.component';
import { EditBonLivraisonComponent } from './edit-bon-livraison/edit-bon-livraison.component';
import { EditFournisseurComponent } from './edit-fournisseur/edit-fournisseur.component';
import { ListFournisseursComponent } from './list-fournisseurs/list-fournisseurs.component';
import { EditMarqueComponent } from './edit-marque/edit-marque.component';
import { ListMarquesComponent } from './list-marques/list-marques.component';
import { ListStockComponent } from './list-stock/list-stock.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LogoutComponent,
    ListProduitsComponent,
    ListMonturesComponent,
    ListLentillesComponent,
    EditLentilleComponent,
    EditMontureComponent,
    ListLivraisonsComponent,
    EditLivraisonComponent,
    EditBonCommandeComponent,
    ListBonCommandesComponent,
    ListBonLivraisonsComponent,
    EditBonLivraisonComponent,
    EditFournisseurComponent,
    ListFournisseursComponent,
    EditMarqueComponent,
    ListMarquesComponent,
    ListStockComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,

    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
