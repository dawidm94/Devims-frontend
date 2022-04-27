import { Component, OnInit } from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {DateService, Period, PeriodRequest} from "../date.service";
import {HttpService} from "../http.service";
import {environment} from "../../../environments/environment";

export interface DayCheckbox {
  name: string;
  checked: boolean;
  color: ThemePalette;
  workingDay: boolean
  dayOfWeek: number
}

@Component({
  selector: 'app-periodically',
  templateUrl: './periodically.component.html',
  styleUrls: ['./periodically.component.css']
})
export class PeriodicallyComponent implements OnInit {
  dayCheckboxes: Array<DayCheckbox> = [
    {name: 'Poniedziałek', checked: false, color: 'primary', dayOfWeek: 1, workingDay: true},
    {name: 'Wtorek', checked: false, color: 'primary', dayOfWeek: 2, workingDay: true},
    {name: 'Środa', checked: false, color: 'primary', dayOfWeek: 3, workingDay: true},
    {name: 'Czwartek', checked: false, color: 'primary', dayOfWeek: 4, workingDay: true},
    {name: 'Piątek', checked: false, color: 'primary', dayOfWeek: 5, workingDay: true},
    {name: 'Sobota', checked: false, color: 'warn', dayOfWeek: 6, workingDay: false},
    {name: 'Niedziela', checked: false, color: 'warn', dayOfWeek: 0, workingDay: false}
  ]
  fromTime: any;
  toTime: any;
  reason: any;
  firstDayNextMonth = new Date().getMonth() == 11
    ? new Date(new Date().getFullYear() + 1, 0, 1)
    : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
  actualPeriods: Period[] = [];
  showEmptyCheckboxesMessage = false
  showEmptyHoursMessage = false;
  showEmptyReasonMessage = false;
  isSending = false;
  sentSuccessfully = false;
  sentWithError = false;
  sentWith504 = false;
  baseUrl = environment.baseURL

  constructor(private http: HttpClient, public dateService: DateService, public httpService: HttpService) { }

  ngOnInit(): void {
    this.getActualPeriods()
  }

  checkAll() {
    this.dayCheckboxes.forEach(day => {
      day.checked = true
    })
  }

  checkWorkingDay() {
    this.dayCheckboxes.forEach(day => {
      day.checked = day.workingDay
    })
  }

  uncheckAll() {
    this.dayCheckboxes.forEach(day => {
      day.checked = false
    })
  }

  getNextMonthName() {
    return this.firstDayNextMonth.toLocaleDateString('default', {month: 'long'});
  }

  getDaysInMonth(month: number, year: number) {
    let date = new Date(year, month, 1);
    let days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  send(){
    this.clearValidateMessages();
    if (!this.isValidate()) {
      return;
    }
    this.isSending = true
    let toSend: Date[] = [];
    let periods: Period[] = []
    let checkedDays = this.dayCheckboxes.filter(value => value.checked).map(value => value.dayOfWeek)
    let seasonId = sessionStorage.getItem('seasonId');

    this.getDaysInMonth(this.firstDayNextMonth.getMonth(), this.firstDayNextMonth.getFullYear()).forEach( day => {
      if (checkedDays.includes(day.getDay())) {
        toSend.push(day);
      }
    })
    toSend.forEach(day => {
      let date = this.dateService.convertDate(day);
      let period = this.dateService.getPeriodWithStringDate(date, this.fromTime, date, this.toTime, this.reason)
      periods.push(period)
    })
    let request = {periods: periods, seasonId: seasonId}

    this.actualPeriods.forEach(actualPeriod => {
      request.periods.push(actualPeriod);
    })

    this.sendPeriods(request)
  }

  private sendPeriods(request: PeriodRequest) {
    this.http.post<any>(this.baseUrl + 'esor/periods', request, this.httpService.getOptionWithEsorToken()).subscribe({
      next: () => {this.sentSuccessfully = true},
      error: err => {
        console.log(err);
        if (err.status == 504) {
          this.sentWith504 = true;
        } else {
          this.sentWithError = true
        }
      }
    })
  }

  private isValidate() {
    let errorCounter = 0;
    if (this.dayCheckboxes.filter(value => value.checked).length == 0 ) {
      this.showEmptyCheckboxesMessage = true;
      errorCounter+=1;
    }
    if (this.fromTime == undefined || this.toTime == undefined) {
      this.showEmptyHoursMessage = true;
      errorCounter+=1
    }

    if (this.reason == undefined) {
      this.showEmptyReasonMessage = true;
      errorCounter+=1
    }

    return errorCounter == 0;

  }

  getActualPeriods() {
    this.http.get<any>(this.baseUrl + 'esor/periods', this.httpService.getOptionsWithSeasonId()).subscribe({
      next: value => this.actualPeriods = value.items,
      error: err => console.log(err)
    })
  }

  private clearValidateMessages() {
    this.showEmptyReasonMessage = false;
    this.showEmptyCheckboxesMessage = false;
    this.showEmptyHoursMessage = false;
  }
}
