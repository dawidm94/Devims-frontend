import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-match-details-dialog',
  templateUrl: './match-details-dialog.component.html',
  styleUrls: ['./match-details-dialog.component.css']
})
export class MatchDetailsDialogComponent implements OnInit {

  matchDetails: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public matchId: number,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.showMatchDetails(this.matchId)
  }

  showMatchDetails(matchId: number) {
    let esorToken = sessionStorage.getItem('esorToken') as string
    let headers = new HttpHeaders({'Esor-Token': esorToken });

    this.http.get<any>('http://localhost:8080/esor/match/' + matchId, {headers: headers}).subscribe({
      next: response => {
        console.log(response)
        this.matchDetails = response

      },
      error: err => {
        console.log(err)
      }
    })
  }

  getIconNameByStatus(status: any) {

    switch (status) {
      case -1:
      case '-1': {
        // return 'close'
        return 'sentiment_very_dissatisfied'
      }
      case 1:
      case '1': {
        // return 'question_mark'
        return 'sentiment_neutral'
      }
      case 2:
      case '2': {
        // return 'check'
        return 'mood'
      }
      default: {
        return 'help'
      }
    }
  }

  getIconColor(status: any) {
    switch (status) {
      case -1:
      case '-1': {
        return 'color: red'
      }
      case 1:
      case '1': {
        return 'color: blue'
      }
      case 2:
      case '2': {
        return 'color: green'
      }
      default: {
        return 'color: black'
      }
    }
  }
}
