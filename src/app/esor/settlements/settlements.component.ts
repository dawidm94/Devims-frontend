import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {HttpService} from "../http.service";
import {environment} from "../../../environments/environment";

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
  isVeryLongLoading = false;
  baseUrl = environment.baseURL
  displayedColumns: string[] = ['position', 'paid', 'date', 'league', 'matchTeams', 'toPay', 'comment'];

  private getSettlements() {
    this.http.get<any>(this.baseUrl + 'esor/settlement', this.httpService.getOptionsWithSeasonId()).subscribe({
      next: response => {
        this.timetable = response
        console.log(this.timetable)
      },
      error: err => {
        console.log(err)
      }
    })
  }

  updateSettlements() {
    let settlements = this.timetable.map((src: { settlement: any; }) => src.settlement)
    this.http.put<any>(this.baseUrl + 'esor/settlement', settlements, this.httpService.getOptionWithEsorToken()).subscribe({
      next: () => {
        console.log('pykło')
      },
      error: () => {
        console.log('nie pykło')
      }
    });
  }

  test() {
    console.log('check')
  }

  private handleLongLoading() {
    setTimeout( ()=>{
      this.isLongLoading = true;
    }, 3 * 1000) // 3 sec

    setTimeout( ()=>{
      this.isVeryLongLoading = true;
    }, 7 * 1000) // 7 sec
  }
}
