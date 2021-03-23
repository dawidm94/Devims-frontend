import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {AppConstants} from '../../common/app.constants';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {SocialUserDto} from '../login.model';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.css']
})
export class LoginCardComponent implements OnInit {

  @Output() alertMsg = new EventEmitter()

  isSubmitClicked = false;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl(''),
  });

  constructor(private http: HttpClient, private route: ActivatedRoute, private authService: SocialAuthService, private router: Router) { }

  ngOnInit(): void {
  }


  submitLogin() {
    this.isSubmitClicked = true;
    if (this.loginForm.valid) {
      this.http.post<string>(AppConstants.API_BASE_URL + 'user/login',this.loginForm.value).subscribe(
        data => {
          console.log('zalogowany')
          console.log(data)
          sessionStorage.setItem('token', data);
          if (data) {
            this.router.navigate(['home']);
          }
        }
      )
    }
  }

  get loginInvalid() {
    return this.isSubmitClicked && this.loginForm.get('email')?.invalid;
  }


  loginViaSocialMedia(socialServiceName: string): void {
    let provider = socialServiceName == 'Google' ? GoogleLoginProvider.PROVIDER_ID : FacebookLoginProvider.PROVIDER_ID;
    let token: string;
    this.authService.signIn(provider).then(
      data => {
        let socialUserDto = new SocialUserDto(data.email, data.firstName, data.lastName, data.authToken, data.photoUrl, socialServiceName);
        token = data.authToken
        this.http.post<any>(AppConstants.API_BASE_URL + 'user/socialLogin', socialUserDto).subscribe(
          data => {
            sessionStorage.setItem('token', token);
            this.router.navigate(['home'])
          }
        )
      },
      reason => {
        if (reason.error === 'popup_closed_by_user') {
          this.alertMsg.emit('Brak możliwości logowania się w trybie Incognito. Zaloguj się w zwykłym trybie, bądź standardowym logowaniem.')
        }
      }
    )
  }

}
