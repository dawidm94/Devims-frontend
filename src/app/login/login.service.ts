import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  public handleLoginSuccess(tokenValue: string): void {
    sessionStorage.setItem('token', tokenValue);
  }
}
