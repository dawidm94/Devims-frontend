import { Component, OnInit } from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HttpService} from "../http.service";
import {PeriodRequest} from "../date.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-delete-all',
  templateUrl: './delete-all.component.html',
  styleUrls: ['./delete-all.component.css']
})
export class DeleteAllComponent implements OnInit {
  sliderValue = 0;
  deleted = false;
  baseUrl = environment.baseURL

  constructor(private http: HttpClient, public httpService: HttpService) { }

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

    this.http.post<any>(this.baseUrl + 'esor/periods', request).subscribe({
      next: () => {this.deleted = true},
      error: err => {console.log(err)}
    })
  }

  getSliderWidth() {
    if (window.screen.width > 900) {
      return "width: 400px"
    } else {
      return "width: " + (window.screen.width - 50) + "px"
    }
  }

  getImageSize() {
    if (window.screen.width > 900) {
      return "width: 20%; height: 20%"
    } else {
      return "width: 90%; height: 90%"
    }

  }
}
