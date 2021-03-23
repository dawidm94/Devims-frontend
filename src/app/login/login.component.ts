import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from '@angular/router';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {SocialUserDto} from './login.model';
import {AppConstants} from '../common/app.constants';


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

  constructor(private http: HttpClient, private route: ActivatedRoute, private authService: SocialAuthService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isLogout = params['logout'];
      if (this.isLogout) {
        this.showAlert = true;
        this.alertMessage = 'Wylogowano użytkownika. Proszę o ponowne zalogowanie.'
      }
    });
  }

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


  loginViaSocialMedia(socialServiceName: string): void {
    let provider = socialServiceName == 'Google' ? GoogleLoginProvider.PROVIDER_ID : FacebookLoginProvider.PROVIDER_ID;
    let token: string;
    this.authService.signIn(provider).then(
      data => {
        let socialUserDto = new SocialUserDto(data.email, data.firstName, data.lastName, data.authToken, data.photoUrl, socialServiceName);
        token = data.authToken
        this.http.post<any>(AppConstants.API_BASE_URL + 'socialLogin', socialUserDto).subscribe(
          data => {
            sessionStorage.setItem('token', token);
            this.router.navigate(['home'])
          }
        )
      },
    reason => {
      if (reason.error === 'popup_closed_by_user') {
        this.showAlert = true;
        this.alertMessage = 'Brak możliwości logowania się w trybie Incognito. Zaloguj się w zwykłym trybie, bądź standardowym logowaniem.'
      }
    }
  )
  }
}
