import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {HttpService} from "../http.service";
import {Platform} from "@angular/cdk/platform";

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.css']
})
export class EarningsComponent implements OnInit {

  baseUrl = environment.baseURL
  isMobile = window.screen.width < 500
  seasons: any = []
  firstEsorSeasonId = 17
  selectedSeasonId: number | undefined;
  isLoadingEarnings = false;
  esorEarnings: any | undefined
  isError = false;
  intervalId: number | undefined;

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    public platform: Platform
  ) { }

  ngOnInit(): void {
    this.getSeasons()
  }

  getSeasons(): void {
    this.http.get<any>(this.baseUrl + 'esor/seasons', this.httpService.getOptionWithEsorToken()).subscribe({
      next: response => {
        let seasons = response.reverse();
        let firstEsorSeasonIndex = seasons.findIndex((x: { id: number; }) => x.id == this.firstEsorSeasonId)
        this.seasons = seasons.slice(0, firstEsorSeasonIndex + 1)},
      error: err => {console.log(err)}
    })
  }

  getSeasonEarnings() {
    this.isLoadingEarnings = true;
    this.isError = false;

    this.http.post<any>(this.baseUrl + 'esor/earnings', this.selectedSeasonId, this.httpService.getOptionWithEsorTokenAndContentTypeJson()).subscribe({
      next: response => {
        this.intervalId = setInterval(() => {this.checkEarningsStatus(response.uuid)}, 1000);
      },

      error: err => {
        console.log(err);
        this.isLoadingEarnings = false;
        this.isError = true;
        this.esorEarnings = undefined
      }
    })
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  private checkEarningsStatus(uuid: string) {
    this.http.get<any>(this.baseUrl + 'esor/earnings/check/' + uuid, this.httpService.getOptionWithEsorToken()).subscribe({
      next: response => {
        if (response.status != 'PENDING') {
          clearInterval(this.intervalId);
          this.esorEarnings = response
          this.isLoadingEarnings = false;

          if (response.status == 'FAILED') {
            this.isError = true;
          }
        }
      },
      error: err => {console.log(err)}
    })
  }
}
