import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-busy-times',
  templateUrl: './busy-times.component.html',
  styleUrls: ['./busy-times.component.css']
})
export class BusyTimesComponent implements OnInit {
  periods: any | undefined;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    let seasonId =  sessionStorage.getItem('seasonId') as string;

    let esorToken = sessionStorage.getItem('esorToken') as string

    if (esorToken) {
      let headers = new HttpHeaders({'Esor-Token': esorToken});

      let params = new HttpParams();
      params = params.append('seasonId', seasonId);

      this.http.get<any>('http://localhost:8080/esor/periods', {headers: headers, params: params}).subscribe({
        next: value => {console.log(value); this.periods = value.items; console.log(this.periods)},
        error: err => console.log(err)
      })
    }
  }

  displayedColumns: string[] = ['position', 'dateFrom', 'dateTo', 'reason'];

}
