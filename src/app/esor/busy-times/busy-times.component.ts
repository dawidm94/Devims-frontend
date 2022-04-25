import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {HttpService} from "../http.service";

@Component({
  selector: 'app-busy-times',
  templateUrl: './busy-times.component.html',
  styleUrls: ['./busy-times.component.css']
})
export class BusyTimesComponent implements OnInit {
  periods: any | undefined;

  constructor(private http: HttpClient, public httpService: HttpService) { }

  ngOnInit(): void {
    this.http.get<any>('http://localhost:8080/esor/periods', this.httpService.getOptionsWithSeasonId()).subscribe({
      next: value => {console.log(value); this.periods = value.items},
      error: err => console.log(err)
    })
  }

  displayedColumns: string[] = ['position', 'dateFrom', 'dateTo', 'reason'];

}
