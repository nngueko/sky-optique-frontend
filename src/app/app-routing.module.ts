import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGaurdService } from './services/auth-gaurd.service';
import {ListMonturesComponent} from "./list-montures/list-montures.component";
import {EditMontureComponent} from "./edit-monture/edit-monture.component";
import {EditLentilleComponent} from "./edit-lentille/edit-lentille.component";
import {ListLentillesComponent} from "./list-lentilles/list-lentilles.component";

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate:[AuthGaurdService] },
  { path: 'home', component: HomeComponent, canActivate:[AuthGaurdService] },
  { path: 'montures', component: ListMonturesComponent, canActivate:[AuthGaurdService] },
  { path: 'add-monture', component: EditMontureComponent, canActivate:[AuthGaurdService] },
  { path: 'update-monture/:id', component: EditMontureComponent, canActivate:[AuthGaurdService] },
  { path: 'lentilles', component: ListLentillesComponent, canActivate:[AuthGaurdService] },
  { path: 'add-lentille', component: EditLentilleComponent, canActivate:[AuthGaurdService] },
  { path: 'update-lentille/:id', component: EditLentilleComponent, canActivate:[AuthGaurdService] },
  { path: 'login', component: LoginComponent },
  // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
