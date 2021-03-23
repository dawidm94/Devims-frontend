import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AppConstants} from "../common/app.constants";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  isAuthenticated(): Observable<boolean> {
    let token = String(sessionStorage.getItem('token'));
    console.log('token')
    console.log(token)
    let url = AppConstants.API_BASE_URL + 'isTokenValid?token=' + encodeURIComponent(token)
    return this.http.get<boolean>(url)
  }
}
