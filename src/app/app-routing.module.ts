import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGaurdService } from './services/auth-gaurd.service';
import {ListMonturesComponent} from "./list-montures/list-montures.component";
import {EditMontureComponent} from "./edit-monture/edit-monture.component";
import {EditLentilleComponent} from "./edit-lentille/edit-lentille.component";
import {ListLentillesComponent} from "./list-lentilles/list-lentilles.component";
import {ListLivraisonsComponent} from "./list-livraisons/list-livraisons.component";
import {EditLivraisonComponent} from "./edit-livraison/edit-livraison.component";
import {ListBonLivraisonsComponent} from "./list-bon-livraisons/list-bon-livraisons.component";
import {EditBonLivraisonComponent} from "./edit-bon-livraison/edit-bon-livraison.component";
import {ListFournisseursComponent} from "./list-fournisseurs/list-fournisseurs.component";
import {EditFournisseurComponent} from "./edit-fournisseur/edit-fournisseur.component";

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate:[AuthGaurdService] },
  { path: 'home', component: HomeComponent, canActivate:[AuthGaurdService] },
  { path: 'login', component: LoginComponent },

  { path: 'montures', component: ListMonturesComponent, canActivate:[AuthGaurdService] },
  { path: 'add-monture', component: EditMontureComponent, canActivate:[AuthGaurdService] },
  { path: 'update-monture/:id', component: EditMontureComponent, canActivate:[AuthGaurdService] },

  { path: 'lentilles', component: ListLentillesComponent, canActivate:[AuthGaurdService] },
  { path: 'add-lentille', component: EditLentilleComponent, canActivate:[AuthGaurdService] },
  { path: 'update-lentille/:id', component: EditLentilleComponent, canActivate:[AuthGaurdService] },

  { path: 'livraisons', component: ListLivraisonsComponent, canActivate:[AuthGaurdService] },
  { path: 'add-livraison', component: EditLivraisonComponent, canActivate:[AuthGaurdService] },
  { path: 'update-livraison/:id', component: EditLivraisonComponent, canActivate:[AuthGaurdService] },

  { path: 'bonLivraisons', component: ListBonLivraisonsComponent, canActivate:[AuthGaurdService] },
  { path: 'add-bonLivraison', component: EditBonLivraisonComponent, canActivate:[AuthGaurdService] },
  { path: 'update-bonLivraison/:id', component: EditBonLivraisonComponent, canActivate:[AuthGaurdService] },

  { path: 'fournisseurs', component: ListFournisseursComponent, canActivate:[AuthGaurdService] },
  { path: 'add-fournisseur', component: EditFournisseurComponent, canActivate:[AuthGaurdService] },
  { path: 'update-fournisseur/:id', component: EditFournisseurComponent, canActivate:[AuthGaurdService] },

  // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
