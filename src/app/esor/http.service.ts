import { Injectable } from '@angular/core';
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  currentSeasonId = environment.currentSeasonId

  constructor() { }

  getOptionWithEsorToken() {
    let esorToken = sessionStorage.getItem('esorToken') as string
    let headers = new HttpHeaders({'Esor-Token': esorToken});

    return {headers: headers};
  }

  getOptionWithEsorTokenAndContentTypeJson() {
    let esorToken = sessionStorage.getItem('esorToken') as string
    let headers = new HttpHeaders({'Esor-Token': esorToken}).set('Content-Type','application/json');

    return {headers: headers};
  }

  getOptionWithEsorTokenWithBlobAsJsonResponseType() {
    let optionsWithSeasonId = this.getOptionsWithSeasonId();

    return {headers: optionsWithSeasonId.headers, params: optionsWithSeasonId.params, responseType: 'blob' as 'json'};
  }

  getOptionsWithSeasonId() {
    let esorToken = sessionStorage.getItem('esorToken') as string

    let headers = new HttpHeaders({'Esor-Token': esorToken});
    let params = this.getHttpParamsWithSeasonId();

    return {headers: headers, params: params}
  }

  private getHttpParamsWithSeasonId() {
    let seasonId = sessionStorage.getItem('seasonId');
    let params = new HttpParams();

    if (seasonId != null) {
      params = params.append('seasonId', seasonId);

    } else {
      params = params.append('seasonId', this.currentSeasonId);
    }

    return params;
  }

  getOptionWithCustomParams(customParams: HttpParams) {
    let esorToken = sessionStorage.getItem('esorToken') as string
    let headers = new HttpHeaders({'Esor-Token': esorToken});

    return {headers: headers, params: customParams};
  }

  getOptionWithSeasonIdAndCustomParams(params: HttpParams) {
    let optionsWithSeasonId = this.getOptionsWithSeasonId();
    params.keys().forEach(key => {
      let value = params.get(key);
      if (value != null) {
        optionsWithSeasonId.params = optionsWithSeasonId.params.append(key, value);
      }
    })
    return optionsWithSeasonId;
  }
}
