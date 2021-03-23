import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AppConstants} from '../../common/app.constants';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration-card',
  templateUrl: './registration-card.component.html',
  styleUrls: ['./registration-card.component.css']
})
export class RegistrationCardComponent implements OnInit {

  @Output() alertMsg = new EventEmitter()
  @Output() registerSuccessful = new EventEmitter()

  emailBlur = false;
  confirmPasswordBlur = false;

  registerForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  register() {
    if (this.registerForm.valid && this.registerForm.value.password === this.registerForm.value.confirmPassword) {
      let objectToSend = this.registerForm.value
      delete objectToSend.confirmPassword
      console.log(objectToSend)
      this.http.post(AppConstants.API_BASE_URL + 'user/register', objectToSend).subscribe(
        data => {
          console.log(data)
          if(data) {
            console.log('zarejestrowano')
            this.registerSuccessful.emit(true);
          }
        }
      )
    }
  }

  get email() {
    return this.registerForm.get('email')
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword')
  }

  get password() {
    return this.registerForm.get('password')
  }

  passwordMatches() {
    if (this.password && this.confirmPassword && this.password.value === this.confirmPassword.value) {
      return true;
    } else {
      return false;
    }
  }
}
