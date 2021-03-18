import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {LoginService} from "../login.service";
import {AppConstants} from "../../common/app.constants";

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.css']
})
export class OauthComponent implements OnInit {

  authorizationCode : string | null | undefined;
  serviceName : string | null | undefined;

  constructor(private route: ActivatedRoute, private http: HttpClient, private loginService: LoginService) { }

  ngOnInit(): void {
    this.serviceName = this.route.snapshot.paramMap.get('serviceName');
    this.authorizationCode = this.route.snapshot.queryParamMap.get('code');
    if (this.serviceName != null) {
      let url = AppConstants.API_BASE_URL + 'ouath/' + this.serviceName
      this.http.post<any>(url, this.authorizationCode).subscribe(token => {
        this.loginService.handleLoginSuccess(token['value'])
        window.location.href = "home"
      },
        error => console.log(error))
    }
  }

}
