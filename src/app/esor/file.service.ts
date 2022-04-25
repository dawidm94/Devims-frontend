import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {
  }

  downloadDelegation(matchId: number | undefined) {
    let esorToken = sessionStorage.getItem('esorToken') as string
    let headers = new HttpHeaders({'Esor-Token': esorToken });

    this.http.get<any>('http://localhost:8080/esor/match/' + matchId, {headers: headers}).subscribe({
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
    let esorToken = sessionStorage.getItem('esorToken') as string
    let headers = new HttpHeaders({'Esor-Token': esorToken});

    this.http.get<any>(url, {headers: headers, responseType: 'blob' as 'json'}).subscribe({
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
