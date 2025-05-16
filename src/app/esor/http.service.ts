import { Injectable } from '@angular/core';
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  currentSeasonId = environment.currentSeasonId

  constructor() { }

  getOptionWithEsorTokenWithBlobAsJsonResponseType() {
    let optionsWithSeasonId = this.getOptionsWithSeasonId();

    return {params: optionsWithSeasonId.params, responseType: 'blob' as 'json'};
  }

  getOptionsWithSeasonId() {
    let params = this.getHttpParamsWithSeasonId();

    return {params: params}
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
    return {params: customParams};
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
