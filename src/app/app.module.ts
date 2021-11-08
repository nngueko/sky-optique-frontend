import { NgModule } from '@angular/core';
import {FormGroup, FormsModule} from '@angular/forms';
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
    EditMontureComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
