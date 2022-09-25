import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpService} from "../http.service";
import {environment} from "../../../environments/environment";
import {ConfirmedNotification, PeriodRequest} from "../date.service";

@Component({
  selector: 'app-accept-nomination-dialog',
  templateUrl: './accept-nomination-dialog.component.html',
  styleUrls: ['./accept-nomination-dialog.component.css']
})
export class AcceptNominationDialogComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AcceptNominationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public matchId: number,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.getNomination();
    this.getMatch();
    this.getUser();
  }

  baseUrl = environment.baseURL
  mobile = window.screen.width < 500;
  user: any;
  match: any = '';
  nomination: any = '';
  nominationHeader = ''

  grossAmount = 0
  transportAmount = 0
  toPay = 0
  showTransportRates = false;
  showGrossRates = false;

  closeDialog(): void {
    this.dialogRef.close(false)
  }

  getNomination(): void {
    this.http.get<any>(this.baseUrl + 'esor/nominations/' + this.matchId, this.httpService.getOptionsWithSeasonId()).subscribe({
      next: (response) => {
        if (response.equivalentOptions && response.equivalentOptions.length > 0) {
          this.grossAmount = response.equivalentOptions[0].gross
          this.calculateNetAmount()
        }
        this.nominationHeader = response.league + ': ' + response.round + ': Mecz nr ' + response.matchNumber + ' (' + response.date + ')'
        this.nomination = response
      },
      error: err => {
        console.log(err)
      }
    })
  }
  getUser(): void {
    this.http.get<any>(this.baseUrl + 'esor/user', this.httpService.getOptionsWithSeasonId()).subscribe({
      next: (response) => {
        this.user = response
      },
      error: err => {
        console.log(err)
      }
    })
  }

  getMatch(): void {
    this.http.get<any>(this.baseUrl + 'esor/match/' + this.matchId, this.httpService.getOptionsWithSeasonId()).subscribe({
      next: (response) => {
        this.match = response
      },
      error: err => {
        console.log(err)
      }
    })
  }

  goToGoogleMaps() {
    let origin = this.user.address + '+' + this.user.city
    let destination = this.match.hall
    let url = 'https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=' + origin + '&destination=' + destination
    window.open(url, "_blank");
  }

  acceptNomination(): void {

    let notification = {arrival: '', buy: 1, costAccommodation: 0, costPerKilometerGross: this.nomination.perKilometer.length > 0 ? this.nomination.perKilometer[0].gross : null, costTransport: this.transportAmount + '', costTravel: 0, delegationNumber: null,
      departure: '', documentType: 0, equivalent: this.grossAmount, matchId: this.matchId, privateTransport: false, reservation: false, routes: [], routesDistanceKilometers: 0,
      toPay: this.toPay, vehicleBrand: '', vehicleRegistrationNumber: '', vehicleEngineSize: ''}
    this.sendNotification(notification)
  }

  toggleGrossRates() {
    this.showGrossRates = !this.showGrossRates
  }

  toggleTransportRates() {
    this.showTransportRates = !this.showTransportRates
  }

  calculateNetAmount() {
    if (this.grossAmount == 0) {
      this.toPay = 0
    } else {
      this.toPay = (this.grossAmount - (Math.round(0.12 * (this.grossAmount - this.grossAmount * 0.2)))) + this.transportAmount * 1 //needed to not treat as string (love JS)
    }
  }

  private sendNotification(request: ConfirmedNotification) {
    this.http.post<any>(this.baseUrl + 'esor/nominations/' + this.matchId + '/confirm', request, this.httpService.getOptionWithEsorToken()).subscribe({
      next: () => {
        this.dialogRef.close(true)
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
