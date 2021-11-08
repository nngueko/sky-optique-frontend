import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilisateurModel } from '../models/utilisateur.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {


  isLogin = false ;
  isLoginSubject = new Subject<boolean>();
  emitIsLoginSubject(){
    this.isLoginSubject.next(this.isLogin);
  }

  constructor(private httpClient: HttpClient) { }

  authenticate(utilisateur : UtilisateurModel) {
    return this.httpClient
      .post('http://localhost:8080/utilisateur/login', utilisateur);
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('pseudo');
    if(!(user === null)){
      //this.emitIsLoginSubject();
      return true
    }
    return false;
  }

  login(utilisateur : UtilisateurModel) {
    sessionStorage.setItem('pseudo', utilisateur.pseudo);
    sessionStorage.setItem('nom', utilisateur.nom);
    this.isLogin = true;
    this.emitIsLoginSubject();
  }

  logOut() {
    sessionStorage.removeItem('pseudo');
    sessionStorage.removeItem('nom');
    this.isLogin = false;
    this.emitIsLoginSubject();
  }

}
