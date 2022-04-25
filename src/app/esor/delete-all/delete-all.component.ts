import { Component, OnInit } from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PeriodRequest} from "../periodically/periodically.component";

@Component({
  selector: 'app-delete-all',
  templateUrl: './delete-all.component.html',
  styleUrls: ['./delete-all.component.css']
})
export class DeleteAllComponent implements OnInit {
  sliderValue = 0;
  deleted = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  formatLabel(value: number) {
    return value + '%';
  }

  getSliderColor(): ThemePalette {
    return this.sliderValue == 100 ? 'warn' : 'accent';
  }

  deleteAllPeriods(): void {
    let seasonId = sessionStorage.getItem('seasonId');
    this.sendPeriods({seasonId: seasonId, periods: []})
  }

  private sendPeriods(request: PeriodRequest) {
    let esorToken = sessionStorage.getItem('esorToken') as string
    let headers = new HttpHeaders({'Esor-Token': esorToken});

    this.http.post<any>('http://localhost:8080/esor/periods', request, {headers: headers}).subscribe({
      next: () => {this.deleted = true},
      error: err => {console.log(err)}
    })
  }

}
