import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HttpService} from "../http.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-match-details-dialog',
  templateUrl: './match-details-dialog.component.html',
  styleUrls: ['./match-details-dialog.component.css']
})
export class MatchDetailsDialogComponent implements OnInit {

  matchDetails: any = {};
  baseUrl = environment.baseURL

  constructor(
    @Inject(MAT_DIALOG_DATA) public matchId: number,
    private http: HttpClient,
    private httpService: HttpService,
  ) { }

  ngOnInit(): void {
    this.showMatchDetails(this.matchId)
  }

  showMatchDetails(matchId: number) {
    this.http.get<any>(this.baseUrl + 'esor/match/' + matchId, this.httpService.getOptionWithEsorToken()).subscribe({
      next: response => {
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
        return 'sentiment_very_dissatisfied'
      }
      case 1:
      case '1': {
        return 'sentiment_neutral'
      }
      case 2:
      case '2': {
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
