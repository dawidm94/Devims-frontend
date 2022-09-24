import {Component, OnInit} from '@angular/core';
import {DateService, Period, PeriodRequest} from "../date.service";
import {HttpClient} from "@angular/common/http";
import {HttpService} from "../http.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-single-period',
  templateUrl: './single-period.component.html',
  styleUrls: ['./single-period.component.css']
})
export class SinglePeriodComponent implements OnInit {
  fromDate: Date | undefined;
  fromTime: Date | undefined;
  toDate: any | undefined;
  toTime: any | undefined;
  fromChosen = false
  toChosen = false;
  reasonFilled = false;
  reason: any;
  isSending = false;
  sentSuccessfully = false;
  sentWithError = false;
  actualPeriods: Period[] = [];
  baseUrl = environment.baseURL
  wholeDay = false;

  constructor(public dateService: DateService, public http: HttpClient, public httpService: HttpService) {}

  ngOnInit(): void {
    this.getActualPeriods();
  }

  toggleWholeDay() {
    this.updateFromChosen()
    this.updateToChosen()
  }

  updateFromChosen() {
    this.fromChosen = this.fromDate != undefined && (this.fromTime != undefined && !this.wholeDay || this.wholeDay);
  }

  updateToChosen() {
    this.toChosen = this.toDate != undefined && (this.toTime != undefined && !this.wholeDay || this.wholeDay);
  }

  updateReasonFilled() {
    console.log(this.reason)
    this.reasonFilled = this.reason != undefined && this.reason != '' && this.reason.length > 1;
  }

  send() {
    this.isSending = true;
    let seasonId = sessionStorage.getItem('seasonId');
    let fromTime = this.wholeDay ? '00:00' : this.fromTime;
    let toTime = this.wholeDay ? '23:59' : this.toTime;
    let newPeriod = this.dateService.getPeriodWithDate(this.fromDate, fromTime, this.toDate, toTime, this.reason);
    this.actualPeriods.push(newPeriod);
    let request = {periods: this.actualPeriods, seasonId: seasonId}
    this.sendPeriods(request)
  }

  getActualPeriods() {
    this.http.get<any>(this.baseUrl + 'esor/periods', this.httpService.getOptionsWithSeasonId()).subscribe({
      next: value => this.actualPeriods = value.items,
      error: err => console.log(err)
    })
  }

  private sendPeriods(request: PeriodRequest) {
    this.http.post<any>(this.baseUrl + 'esor/periods', request, this.httpService.getOptionWithEsorToken()).subscribe({
      next: () => {
        this.sentSuccessfully = true;
        this.isSending = false;
        },
      error: err => {
        this.isSending = false;
        if (err.status == 504) {
          this.sentSuccessfully = true;
        } else {
          this.sentWithError = true
        }
      }
    })
  }
}
