import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
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
    ListBonCommandesComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
