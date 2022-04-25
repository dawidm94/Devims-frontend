import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HttpService} from "../http.service";

@Component({
  selector: 'app-esor-home',
  templateUrl: './esor-home.component.html',
  styleUrls: ['./esor-home.component.css']
})
export class EsorHomeComponent implements OnInit {

  constructor(private http: HttpClient, public httpService: HttpService) { }

  upcomingMatch: any;

  ngOnInit(): void {
    this.updateUpcomingMatch()
  }

  private updateUpcomingMatch() {
    this.http.get<any>('http://localhost:8080/esor/timetable/upcoming', this.httpService.getOptionsWithSeasonId()).subscribe({
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
