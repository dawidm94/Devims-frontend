import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpService} from "../http.service";
import {SelectionModel} from "@angular/cdk/collections";
import {PeriodRequest} from "../date.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-busy-times',
  templateUrl: './busy-times.component.html',
  styleUrls: ['./busy-times.component.css']
})
export class BusyTimesComponent implements OnInit {
  periods: any | undefined;
  isSending = false;
  sentSuccessfully = true;
  sentWithError = true;
  baseUrl = environment.baseURL

  constructor(private http: HttpClient, public httpService: HttpService) {

  }

  ngOnInit(): void {
    this.http.get<any>(this.baseUrl + 'esor/periods', this.httpService.getOptionsWithSeasonId()).subscribe({
      next: value => this.periods = value.items,
      error: err => console.log(err)
    })
  }

  displayedColumns: string[] = ['select', 'position', 'dateFrom', 'dateTo', 'reason'];
  selection = new SelectionModel<any>(true, []);

  deleteSelections() {
    this.periods = this.periods.filter((singlePeriod: any) => !this.selection.selected.includes(singlePeriod))

    this.isSending = true;
    let seasonId = sessionStorage.getItem('seasonId');
    let request = {periods: this.periods, seasonId: seasonId}
    this.sendPeriods(request)
  }

  private sendPeriods(request: PeriodRequest) {
    this.http.post<any>(this.baseUrl + 'esor/periods', request, this.httpService.getOptionWithEsorToken()).subscribe({
      next: () => {
        this.sentSuccessfully = true;
        this.isSending = false;
      },
      error: err => {
        if (err.status == 504) {
          this.sentSuccessfully = true;
        } else {
          this.sentWithError = true
        }
      }
    })
  }
}
