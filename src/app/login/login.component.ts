import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLogout = false;
  isLoginCard = false;
  isAlert = false;
  alertMessage: string = '';
  isSuccessfulAlert = false;
  alertSuccessfulMessage: string = '';


  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isLogout = params['logout'];
      if (this.isLogout) {
        this.showAlert('Wylogowano użytkownika. Proszę o ponowne zalogowanie.')
      }
    });
  }

  showAlert(alertMsg: string) {
    this.alertMessage = alertMsg;
    this.isAlert = true;
  }

  registerSuccessful(isRegisteredSuccessful: boolean) {
    if(isRegisteredSuccessful) {
      this.isLoginCard = true;
      this.isSuccessfulAlert = true;
      this.alertSuccessfulMessage = 'Pomyślnie zarejestrowano. Proszę się zalogować.'
    }
  }
}
