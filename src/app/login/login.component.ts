import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {AppConstants} from "../common/app.constants";
import {GoogleLoginProvider, SocialAuthService} from "angularx-social-login";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isSubmitClicked = false;
  isLogout = false;
  showAlert = false;
  alertMessage: string = '';

  loginForm: FormGroup = new FormGroup({
    login: new FormControl('', Validators.email),
    password: new FormControl(''),
  });

  submit() {
    this.isSubmitClicked = true;
    if (this.loginForm.valid) {
      console.log(this.loginForm.get('login')?.value)
      console.log(this.loginForm.get('password')?.value)
    }
  }

  public loginViaFacebook() {
    this.http.get(AppConstants.API_BASE_URL + 'generateFacebookLoginUrl').subscribe(
      data => {
      console.log(data);
      if (typeof data === "string") {
        window.location.href = data
      }
    }, error => {
        this.alertMessage = 'Wystąpił błąd. Spróbuj ponownie'
    })
  }

  get loginInvalid() {
    return this.isSubmitClicked && this.loginForm.get('login')?.invalid;
  }

  constructor(private http: HttpClient, private route: ActivatedRoute, private authService: SocialAuthService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isLogout = params['logout'];
      if (this.isLogout) {
        this.showAlert = true;
        this.alertMessage = 'Wylogowano użytkownika. Proszę o ponowne zalogowanie.'
      }
    });
  }

  loginViaGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      data => {
        console.log('data')
        console.log(data)
      },
    reason => {
      if (reason.error === 'popup_closed_by_user') {
        this.showAlert = true;
        this.alertMessage = 'Brak możliwości logowania się przez Google w trybie Incognito. Zaloguj się w zwykłym trybie, bądź innym sposobem.'
      }
    }
  )
  }
}
