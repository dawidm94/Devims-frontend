import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {CanActivate, Router} from "@angular/router";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) { }

  canActivate(): Observable<boolean> {
    return this.auth.isAuthenticated().pipe(
      map(value => {
        if(!value) {
          if(sessionStorage.getItem('token')) {
            sessionStorage.removeItem('token')
            this.router.navigate(['login'], {queryParams: {logout: true}});
          } else {
            this.router.navigate(['login']);
          }
        }
        return value;
      })
    );
  }
}
