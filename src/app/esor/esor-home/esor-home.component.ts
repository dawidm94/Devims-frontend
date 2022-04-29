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
  baseUrl = environment.baseURL

  ngOnInit(): void {
    this.updateUpcomingMatch()
  }

  private updateUpcomingMatch() {
    this.http.get<any>(this.baseUrl + 'esor/timetable/upcoming', this.httpService.getOptionsWithSeasonId()).subscribe({
      next: response => {
        if (response.items != undefined && response.items.length > 0) {
          this.upcomingMatches = response.items;
          console.log(this.upcomingMatches)
        }
        this.upcomingMatchLoaded = true
      },
      error: err => {
        this.upcomingMatchLoaded = true
        console.log(err)
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
}
