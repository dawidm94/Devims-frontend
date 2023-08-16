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
    this.getSettlements();

    this.handleLongLoading();
  }

  timetable: any | undefined;
  isLongLoading = false;
  showMobileHelp = false;
  isVeryLongLoading = false;
  baseUrl = environment.baseURL
  mobile = window.screen.width < 900;
  displayedColumns: string[] = ['position', 'paid', 'date', 'league', 'matchTeams', 'toPay', 'comment'];
  displayedMobileColumns: string[] = ['mobile-paid', 'mobile-date','mobile-teamHome', 'mobile-toPay', 'mobile-details'];
  isError = false;

  private getSettlements() {
    this.http.get<any>(this.baseUrl + 'esor/settlement', this.httpService.getOptionsWithSeasonId()).subscribe({
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
    setTimeout( ()=>{
      this.isLongLoading = true;
    }, 3 * 1000) // 3 sec

    setTimeout( ()=>{
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
}
