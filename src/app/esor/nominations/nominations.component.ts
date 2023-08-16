import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {FileService} from "../file.service";
import {HttpService} from "../http.service";
import {environment} from "../../../environments/environment";
import {MatchDetailsDialogComponent} from "../match-details-dialog/match-details-dialog.component";
import {RejectNominationDialogComponent} from "../reject-nomination-dialog/reject-nomination-dialog.component";
import {AcceptNominationDialogComponent} from "../accept-nomination-dialog/accept-nomination-dialog.component";

@Component({
  selector: 'app-nominations',
  templateUrl: './nominations.component.html',
  styleUrls: ['./nominations.component.css']
})
export class NominationsComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public httpService: HttpService) { }

  ngOnInit(): void {
    this.updateNominations();
  }

  nominations: any | undefined;
  baseUrl = environment.baseURL
  mobile = window.screen.width < 900;
  displayedColumns: string[] = this.mobile ? ['date', 'matchInfo', 'matchTeams', 'actions'] : ['position', 'date', 'matchInfo', 'matchTeams', 'actions'];
  reloading = false;

  private updateNominations() {
    this.http.get<any>(this.baseUrl + 'esor/nominations', this.httpService.getOptionsWithSeasonId()).subscribe({
      next: response => {
        this.nominations = response.items
      },
      error: err => {
        console.log(err)
      },
      complete: () => {
        this.reloading = false
      }
    })
  }

  openMatchDetailsDialog(matchId: number): void {
    let isMobile = window.screen.width < 900
    this.dialog.open(MatchDetailsDialogComponent, {
      width: '450px',
      height: isMobile ? (window.screen.height - 100) + 'px' : '',
      data: matchId
    });
  }

  openAcceptNominationDialog(matchId: number): void {
    let isMobile = window.screen.width < 900
    this.dialog.open(AcceptNominationDialogComponent, {
      width: '450px',
      height: isMobile ? (window.screen.height - 100) + 'px' : '',
      data: matchId
    }).afterClosed().subscribe(isAccepted => {
      if (isAccepted) {
        this.reloading = true;
      }
      this.updateNominations()
    });
  }

  openRejectNominationDialog(matchId: number): void {
    let isMobile = window.screen.width < 900
    this.dialog.open(RejectNominationDialogComponent, {
      width: '450px',
      height: isMobile ? (window.screen.height - 500) + 'px' : '',
      data: matchId
    }).afterClosed().subscribe(isRejected => {
      if (isRejected) {
        this.reloading = true;
      }
      this.updateNominations()
    });
  }

}
