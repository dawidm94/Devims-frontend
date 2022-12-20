import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FileService} from "../file.service";
import {MatDialog} from "@angular/material/dialog";
import {MatchDetailsDialogComponent} from "../match-details-dialog/match-details-dialog.component";
import {HttpService} from "../http.service";
import {environment} from "../../../environments/environment";
import {AcceptNominationDialogComponent} from "../accept-nomination-dialog/accept-nomination-dialog.component";

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public fileService: FileService,
    public httpService: HttpService) { }

  ngOnInit(): void {
    this.updateTimetable();
  }

  timetable: any | undefined;
  baseUrl = environment.baseURL
  mobile = window.screen.width < 500;
  displayedColumns: string[] = this.mobile ? ['date', 'matchInfo', 'matchTeams', 'actions'] : ['position', 'date', 'matchInfo', 'matchTeams', 'actions'];

  private updateTimetable() {
    this.http.get<any>(this.baseUrl + 'esor/timetable/my', this.httpService.getOptionsWithSeasonId()).subscribe({
      next: response => {
        this.timetable = response.items
      },
      error: err => {
        console.log(err)
      }
    })
  }

  getDelegation(match: any) {
    this.fileService.downloadDelegationWithFilename(match.id, match.date + '-' + match.teamHome)
  }

  getMetric(match: any) {
    this.fileService.downloadMetricWithFilename(match.id, match.date + '-' + match.teamHome)
  }

  openMatchDetailsDialog(matchId: number): void {
    let isMobile = window.screen.width < 500
    this.dialog.open(MatchDetailsDialogComponent, {
      width: '450px',
      height: isMobile ? (window.screen.height - 100) + 'px' : '',
      data: matchId
    });
  }

  getIcal(matchId: number) {
    this.fileService.downloadIcal(matchId);
  }

  editNomination(matchId: number) {
    let isMobile = window.screen.width < 500
    this.dialog.open(AcceptNominationDialogComponent, {
      width: '450px',
      height: isMobile ? (window.screen.height - 100) + 'px' : '',
      data: matchId
    }).afterClosed().subscribe()
  }
}
