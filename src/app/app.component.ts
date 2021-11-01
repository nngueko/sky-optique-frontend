import { Component } from '@angular/core';
import { AuthentificationService } from './services/authentification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sky-optique-frontend';
  isLogin = true;
  isLoginSubscription: Subscription = new Subscription;

  constructor(private authentificationService : AuthentificationService) {
    this.authentificationService.isUserLoggedIn();
  }

  ngOnInit(): void {
    this. isLoginSubscription = this.authentificationService.isLoginSubject.subscribe(
      (isLogin) => {
        this.isLogin = isLogin
      }
    );
    this.authentificationService.isUserLoggedIn();
  }

}
