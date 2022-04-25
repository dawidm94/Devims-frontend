import { Component, OnInit } from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

export interface DayCheckbox {
  name: string;
  checked: boolean;
  color: ThemePalette;
  workingDay: boolean
  dayOfWeek: number
}

export interface Period {
  dateFrom: string;
  dateTo: string;
  reason: string;
}

export interface PeriodRequest {
  periods: Period[];
  seasonId: string | null;
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

  constructor(private http: HttpClient) { }

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
      let date = this.convertDate(day);
      let period = {dateFrom: date + ' ' + this.fromTime, dateTo: date + ' ' + this.toTime, reason: this.reason}
      periods.push(period)
    })
    let request = {periods: periods, seasonId: seasonId}

    this.actualPeriods.forEach(actualPeriod => {
      request.periods.push(actualPeriod);
    })
    this.sendPeriods(request)
  }

  convertDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(date.getDate()).padStart(2, '0');

   return  year + "-" + month + "-" + day
  }

  getActualPeriods() {
    let seasonId = sessionStorage.getItem('seasonId');
    let esorToken = sessionStorage.getItem('esorToken') as string
    let headers = new HttpHeaders({'Esor-Token': esorToken});

    let params = new HttpParams();
    if (seasonId != null) {
      params = params.append('seasonId', seasonId);
    }

    this.http.get<any>('http://localhost:8080/esor/periods', {headers: headers, params: params}).subscribe({
      next: value => this.actualPeriods = value.items,
      error: err => console.log(err)
    })
  }

  private sendPeriods(request: PeriodRequest) {
    let esorToken = sessionStorage.getItem('esorToken') as string
    let headers = new HttpHeaders({'Esor-Token': esorToken});

    this.http.post<any>('http://localhost:8080/esor/periods', request, {headers: headers}).subscribe({
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

  private clearValidateMessages() {
    this.showEmptyReasonMessage = false;
    this.showEmptyCheckboxesMessage = false;
    this.showEmptyHoursMessage = false;
  }
}
