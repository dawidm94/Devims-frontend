import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HttpService} from "../http.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-esor-home',
  templateUrl: './esor-home.component.html',
  styleUrls: ['./esor-home.component.css']
})
export class EsorHomeComponent implements OnInit {

  constructor(private http: HttpClient, public httpService: HttpService) { }

  upcomingMatch: any;
  baseUrl = environment.baseURL

  ngOnInit(): void {
    this.updateUpcomingMatch()
  }

  private updateUpcomingMatch() {
    this.http.get<any>(this.baseUrl + 'esor/timetable/upcoming', this.httpService.getOptionsWithSeasonId()).subscribe({
      next: response => {
        if (response.items != undefined && response.items.length > 0) {
          this.upcomingMatch = response.items[0];
        }
      },
      error: err => {
        console.log(err)
      }
    })
  }

}
