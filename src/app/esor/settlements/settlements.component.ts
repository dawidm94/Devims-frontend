import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {HttpService} from "../http.service";
import {environment} from "../../../environments/environment";
import {
  SettlementMobileDetailsDialogComponent
} from "../settlement-mobile-details-dialog/settlement-mobile-details-dialog.component";

@Component({
  selector: 'app-settlements',
  templateUrl: './settlements.component.html',
  styleUrls: ['./settlements.component.css']
})
export class SettlementsComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public httpService: HttpService) { }

  ngOnInit(): void {
    this.getSeasons()
    this.getSettlements();

  }

  timetable: any | undefined;
  isLongLoading = false;
  showMobileHelp = false;
  isVeryLongLoading = false;
  baseUrl = environment.baseURL
  mobile = window.screen.width < 900;
  firstEsorSeasonId = 17
  displayedColumns: string[] = ['position', 'paid', 'date', 'league', 'matchTeams', 'toPay', 'comment'];
  displayedMobileColumns: string[] = ['mobile-paid', 'mobile-date','mobile-teamHome', 'mobile-toPay', 'mobile-details'];
  isError = false;
  isLoadingSettlements = false;
  selectedSeasonId = environment.currentSeasonId;
  seasons: any = []

  getSeasons(): void {
    this.http.get<any>(this.baseUrl + 'esor/seasons', this.httpService.getOptionWithEsorToken()).subscribe({
      next: response => {
        let seasons = response.reverse();
        let firstEsorSeasonIndex = seasons.findIndex((x: { id: number; }) => x.id == this.firstEsorSeasonId)
        this.seasons = seasons.slice(0, firstEsorSeasonIndex + 1)},
      error: err => {console.log(err)}
    })
  }

  getSettlements() {
    this.handleLongLoading();

    this.http.get<any>(this.baseUrl + 'esor/settlement?seasonId=' + this.selectedSeasonId, this.httpService.getOptionWithEsorTokenAndContentTypeJson()).subscribe({
      next: response => {
        this.timetable = response
      },
      error: err => {
        this.isError = true;
        console.log(err)
      }
    })
  }

  updateSettlements() {
    let settlements = this.timetable.map((src: { settlement: any; }) => src.settlement)
    this.http.put<any>(this.baseUrl + 'esor/settlement', settlements, this.httpService.getOptionWithEsorToken()).subscribe();
  }

  private handleLongLoading() {
    this.isLongLoading = false;
    this.isVeryLongLoading = false;
    this.timetable = undefined;

    setTimeout( ()=>{
      if (this.timetable) {
        return
      }
      this.isLongLoading = true;
    }, 3 * 1000) // 3 sec

    setTimeout( ()=>{
      if (this.timetable) {
        return
      }
      this.isVeryLongLoading = true;
    }, 7 * 1000) // 7 sec
  }

  toggleMobileHelp() {
    this.showMobileHelp = !this.showMobileHelp;
  }

  openMobileDetailsDialog(timetable: any): void {
    const dialog = this.dialog.open(SettlementMobileDetailsDialogComponent, {
      width: '450px',
      height: (window.screen.height - 200) + 'px',
      data: timetable
    });

    dialog.afterClosed().subscribe(response => {
      const objectToReplace = this.timetable.find((arrayItem: { settlement: any; }) => arrayItem.settlement.id === response.settlement.id);
      Object.assign(objectToReplace, response)

      this.updateSettlements();
    })
  }

  isActualSeason() {
    return environment.currentSeasonId == this.selectedSeasonId;
  }
}
