import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FileService} from "../file.service";
import {LogInDialogComponent} from "../log-in-dialog/log-in-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatchDetailsDialogComponent} from "../match-details-dialog/match-details-dialog.component";

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public fileService: FileService) { }

  ngOnInit(): void {
    this.updateTimetable();
  }

  displayedColumns: string[] = ['position', 'date', 'matchInfo', 'matchTeams', 'actions'];
  timetable: any | undefined;

  private updateTimetable() {
    let esorToken = sessionStorage.getItem('esorToken') as string
    let seasonId = sessionStorage.getItem('seasonId') as string

    let headers = new HttpHeaders({'Esor-Token': esorToken });

    this.http.get<any>('http://localhost:8080/esor/timetable/my?seasonId=' + seasonId, {headers: headers}).subscribe({
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

  openMatchDetailsDialog(matchId: number): void {
    this.dialog.open(MatchDetailsDialogComponent, {
      width: '4s50px',
      data: matchId
    });
  }

  getIcal(matchId: number) {
    this.fileService.downloadIcal(matchId);
  }
}
