import {Component, OnInit} from '@angular/core';
import {DateService, Period, PeriodRequest} from "../date.service";
import {HttpClient} from "@angular/common/http";
import {HttpService} from "../http.service";

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

  constructor(public dateService: DateService, public http: HttpClient, public httpService: HttpService) {}

  ngOnInit(): void {
    this.getActualPeriods();
  }

  updateFromChosen() {
    this.fromChosen = this.fromDate != undefined && this.fromTime != undefined;
  }

  updateToChosen() {
    this.toChosen = this.toDate != undefined && this.toTime != undefined;
  }

  updateReasonFilled() {
    this.reasonFilled = this.reason != undefined && this.reason != '';
  }

  send() {
    this.isSending = true;
    let seasonId = sessionStorage.getItem('seasonId');
    let newPeriod = this.dateService.getPeriodWithDate(this.fromDate, this.fromTime, this.toDate, this.toTime, this.reason);
    this.actualPeriods.push(newPeriod);
    let request = {periods: this.actualPeriods, seasonId: seasonId}
    this.sendPeriods(request)
  }

  getActualPeriods() {
    this.http.get<any>('http://localhost:8080/esor/periods', this.httpService.getOptionsWithSeasonId()).subscribe({
      next: value => this.actualPeriods = value.items,
      error: err => console.log(err)
    })
  }

  private sendPeriods(request: PeriodRequest) {
    this.http.post<any>('http://localhost:8080/esor/periods', request, this.httpService.getOptionWithEsorToken()).subscribe({
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
