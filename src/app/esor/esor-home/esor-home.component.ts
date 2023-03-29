import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HttpService} from "../http.service";
import {environment} from "../../../environments/environment";
import {MatchDetailsDialogComponent} from "../match-details-dialog/match-details-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {FileService} from "../file.service";

@Component({
  selector: 'app-esor-home',
  templateUrl: './esor-home.component.html',
  styleUrls: ['./esor-home.component.css']
})
export class EsorHomeComponent implements OnInit {

  constructor(private http: HttpClient, public httpService: HttpService, public dialog: MatDialog, public fileService: FileService) { }

  upcomingMatches: any;
  upcomingMatchLoaded = false;
  nominations = 0;
  baseUrl = environment.baseURL
  mobile = window.screen.width < 500;
  screenWidth = window.screen.width;

  ngOnInit(): void {
    this.updateUpcomingMatch()
    this.updateNominations()
  }

  private updateUpcomingMatch() {
    let seasonId = sessionStorage.getItem('seasonId');
    if (!seasonId) {

    }
    this.http.get<any>(this.baseUrl + 'esor/timetable/upcoming', this.httpService.getOptionsWithSeasonId()).subscribe({
      next: response => {
        //Test response
        // response = JSON.parse("{\"items\":[{\"id\":157671,\"matchNumber\":\"M1.2\",\"league\":\"U14M\",\"date\":\"2023-03-29\",\"time\":\"17:00\",\"teamHome\":\"Uczniowski Klub Sportowy Szkola Podstawowa nr 27 Katowice\",\"teamVisitor\":\"Gliwickie Towarzystwo Koszykówki Spółka Akcyjna \"},{\"id\":157671,\"matchNumber\":\"M1.2\",\"league\":\"U14M\",\"date\":\"2023-03-29\",\"time\":\"17:00\",\"teamHome\":\"Uczniowski Klub Sportowy SP 27 Katowice\",\"teamVisitor\":\"Gliwickie Towarzystwo Koszykówki Spółka Akcyjna \"},{\"id\":142112,\"matchNumber\":\"205\",\"league\":\"Energa Basket Liga\",\"date\":\"2023-04-08\",\"time\":\"15:30\",\"teamHome\":\"Tauron GTK Gliwice\",\"teamVisitor\":\"Legia Warszawa\"}]}");
        if (response.items != undefined && response.items.length > 0) {
          this.upcomingMatches = response.items;
        }

        this.upcomingMatchLoaded = true
      },
      error: () => {
        this.upcomingMatchLoaded = true
      }
    })
  }

  private updateNominations() {
    let seasonId = sessionStorage.getItem('seasonId');
    if (!seasonId) {

    }
    this.http.get<any>(this.baseUrl + 'esor/nominations/count', this.httpService.getOptionsWithSeasonId()).subscribe({
      next: response => {
        this.nominations = response
      }
    })
  }

  openMatchDetailsDialog(matchId: number): void {
    this.dialog.open(MatchDetailsDialogComponent, {
      width: '4s50px',
      data: matchId
    });
  }

  getDelegation(match: any) {
    this.fileService.downloadDelegationWithFilename(match.id, match.date + '-' + match.teamHome)
  }

  getMetric(match: any) {
    this.fileService.downloadMetricWithFilename(match.id, match.date + '-' + match.teamHome)
  }

  getIcal(matchId: number) {
    this.fileService.downloadIcal(matchId);
  }

  goToGoogleMaps(matchId: number) {
    this.http.get<any>(this.baseUrl + 'esor/match/' + matchId, this.httpService.getOptionWithEsorToken()).subscribe({
      next: response => {
        let destination = response.hall
        let url = 'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' + destination
        window.open(url, "_blank");

      },
      error: err => {
        console.log(err)
      }
    })

  }
}
