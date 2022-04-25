import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-esor-home',
  templateUrl: './esor-home.component.html',
  styleUrls: ['./esor-home.component.css']
})
export class EsorHomeComponent implements OnInit {

  constructor(private http: HttpClient) { }

  upcomingMatch: any;

  ngOnInit(): void {
    this.updateUpcomingMatch()
  }

  private updateUpcomingMatch() {
    let esorToken = sessionStorage.getItem('esorToken') as string
    let seasonId = sessionStorage.getItem('seasonId') as string

    let headers = new HttpHeaders({'Esor-Token': esorToken });

    this.http.get<any>('http://localhost:8080/esor/timetable/upcoming?seasonId=' + seasonId, {headers: headers}).subscribe({
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
