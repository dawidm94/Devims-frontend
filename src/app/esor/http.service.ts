import { Injectable } from '@angular/core';
import {HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }

  getOptionWithEsorToken() {
    let esorToken = sessionStorage.getItem('esorToken') as string
    let headers = new HttpHeaders({'Esor-Token': esorToken});

    return {headers: headers};
  }
  getOptionWithEsorTokenWithBlobAsJsonResponseType() {
    let esorToken = sessionStorage.getItem('esorToken') as string
    let headers = new HttpHeaders({'Esor-Token': esorToken});

    return {headers: headers, responseType: 'blob' as 'json'};
  }

  getOptionsWithSeasonId() {
    let seasonId = sessionStorage.getItem('seasonId');
    let esorToken = sessionStorage.getItem('esorToken') as string
    let headers = new HttpHeaders({'Esor-Token': esorToken});

    let params = new HttpParams();
    if (seasonId != null) {
      params = params.append('seasonId', seasonId);
    }

    return {headers: headers, params: params}
  }
}
