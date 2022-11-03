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
    let seasonId = sessionStorage.getItem('seasonId');
    let esorToken = sessionStorage.getItem('esorToken') as string
    let headers = new HttpHeaders({'Esor-Token': esorToken});

    let params = new HttpParams();
    if (seasonId != null) {
      params = params.append('seasonId', seasonId);
    } else {
      params = params.append('seasonId', this.currentSeasonId);
    }

    return {headers: headers, params: params}
  }
}
