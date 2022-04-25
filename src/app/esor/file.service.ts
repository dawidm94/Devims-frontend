import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient, private httpService: HttpService) {
  }

  downloadDelegation(matchId: number | undefined) {
    this.http.get<any>('http://localhost:8080/esor/match/' + matchId, this.httpService.getOptionWithEsorToken()).subscribe({
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
    let districtId = 7 //TODO: Change to read from api
    let url = 'http://localhost:8080/esor/match/' + matchId + '/delegation/' + districtId;

    this.downloadFile(url, filename);
  }

  downloadIcal(matchId: number | undefined) {
    if (!matchId) {
      return
    }
    let url = 'http://localhost:8080/esor/match/' + matchId + '/ical'

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
