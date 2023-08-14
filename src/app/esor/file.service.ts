import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HttpService} from "./http.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  baseUrl = environment.baseURL

  constructor(private http: HttpClient, private httpService: HttpService) {
  }

  downloadDelegation(matchId: number | undefined) {
    this.http.get<any>(this.baseUrl + 'esor/match/' + matchId, this.httpService.getOptionWithEsorToken()).subscribe({
      next: response => {
        let date = response.date
        let teamHome = response.teamHome
        let fileName = date + '-' + teamHome
        this.downloadDelegationWithFilename(matchId, fileName);
      },
      error: err => {
        console.log(err)
        this.downloadDelegationWithFilename(matchId, 'Delegacja');
      }
    })
  }

  downloadDelegationWithFilename(matchId: number | undefined, filename: string) {
    if (!matchId) {
      return
    }
    let url = this.baseUrl + 'esor/match/' + matchId + '/delegation/';

    this.downloadFile(url, 'Delegacja-' + filename);
  }

  downloadBlankDelegation(url: string, blanketName: string) {
    this.downloadFile(url, blanketName);
  }

  downloadAllSurveys(password: string) {
    this.downloadFile(this.baseUrl + 'esor/all-surveys?password=' + password, 'Ankiety')
  }

  downloadMetric(matchId: number | undefined) {
    this.http.get<any>(this.baseUrl + 'esor/match/' + matchId, this.httpService.getOptionWithEsorToken()).subscribe({
      next: response => {
        let date = response.date
        let teamHome = response.teamHome
        let fileName = date + '-' + teamHome
        this.downloadMetricWithFilename(matchId, fileName);
      },
      error: err => {
        console.log(err)
        this.downloadMetricWithFilename(matchId, 'Metryczka');
      }
    })
  }

  downloadMetricWithFilename(matchId: number | undefined, filename: string) {
    if (!matchId) {
      return
    }
    let url = this.baseUrl + 'esor/match/' + matchId + '/metric'

    this.downloadFile(url, 'Metryczka-' + filename);
  }

  downloadIcal(matchId: number | undefined) {
    if (!matchId) {
      return
    }
    let url = this.baseUrl + 'esor/match/' + matchId + '/ical'

    this.downloadFile(url, "mecz-" + matchId);
  }

  downloadFile(url: string, filename: string) {
    this.http.get<any>(url, this.httpService.getOptionWithEsorTokenWithBlobAsJsonResponseType()).subscribe({
      next: response => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
