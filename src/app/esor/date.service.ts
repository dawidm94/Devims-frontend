import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {HttpService} from "./http.service";

export interface Period {
  dateFrom: string;
  dateTo: string;
  reason: string;
}

export interface PeriodRequest {
  periods: Period[];
  seasonId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(private http: HttpClient, public httpService: HttpService) { }

  convertDate(date: Date | undefined) {
    if (date == undefined) {
      return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return  year + "-" + month + "-" + day
  }

  getPeriodWithStringDate(dateFrom: null | string, fromTime: any, dateTo: null | string, toTime: any, reason: any) {
    return {dateFrom: dateFrom + ' ' + fromTime, dateTo: dateTo + ' ' + toTime, reason: reason};
  }

  getPeriodWithDate(dateFrom: Date | undefined, fromTime: any, dateTo: Date, toTime: any, reason: any) {
    return {dateFrom: this.convertDate(dateFrom) + ' ' + fromTime, dateTo: this.convertDate(dateTo) + ' ' + toTime, reason: reason};
  }

}
