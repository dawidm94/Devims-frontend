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

export interface ConfirmedNomination {
  arrival: string | '';
  buy: number | 1;
  costAccommodation: number | 0;
  costPerKilometerGross: number | 0;
  costTransport: string | '0';
  costTravel: number | 0;
  delegationNumber: string | null;
  departure: string | '';
  documentType: number | 0;
  equivalent: number | 0;
  matchId: number | null;
  privateTransport: boolean | false;
  reservation: boolean | false;
  routesDistanceKilometers: number | 0;
  toPay: number | 0;
  vehicleBrand: string | '';
  vehicleRegistrationNumber: string | '';
  vehicleEngineSize: string | '';
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
