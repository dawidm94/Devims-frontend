import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpService} from "../http.service";
import {environment} from "../../../environments/environment";
import {ConfirmedNomination} from "../date.service";
import {FileService} from "../file.service";

@Component({
  selector: 'app-accept-nomination-dialog',
  templateUrl: './accept-nomination-dialog.component.html',
  styleUrls: ['./accept-nomination-dialog.component.css']
})
export class AcceptNominationDialogComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AcceptNominationDialogComponent>,
    public fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public matchId: number,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.getNomination();
    this.getMatch();
    this.getFinancialData();
  }

  baseUrl = environment.baseURL
  mobile = window.screen.width < 900;
  financialData: any;
  match: any = '';
  nomination: any = '';
  nominationHeader = ''

  grossAmount = 0
  transportAmount = 0
  toPay = 0
  showTransportRates = false;
  showGrossRates = false;
  buy = 0;
  isAccepted = false;

  closeDialog(): void {
    this.dialogRef.close(false)
  }

  getNomination(): void {
    this.http.get<any>(this.baseUrl + 'esor/nominations/' + this.matchId, this.httpService.getOptionsWithSeasonId()).subscribe({
      next: (response) => {
        if (response.costTransport != null) {
          this.transportAmount = response.costTransport;
        }

        this.buy = response.buy

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
  getFinancialData(): void {
    this.http.get<any>(this.baseUrl + 'esor/user/financial-data', this.httpService.getOptionsWithSeasonId()).subscribe({
      next: (response) => {
        this.financialData = response
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
    let origin = this.financialData.address + '+' + this.financialData.city
    let destination = this.match.hall
    let url = 'https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=' + origin + '&destination=' + destination
    window.open(url, "_blank");
  }

  acceptNomination(): void {
    let nomination = {arrival: '', buy: this.nomination.buy, costAccommodation: 0, costPerKilometerGross: this.nomination.perKilometer.length > 0 ? this.nomination.perKilometer[0].gross : null, costTransport: this.transportAmount + '', costTravel: 0, delegationNumber: this.nomination.delegationNumber,
      departure: '', documentType: 0, equivalent: this.grossAmount, matchId: this.matchId, privateTransport: false, reservation: false, routes: [], routesDistanceKilometers: 0,
      toPay: this.toPay, vehicleBrand: '', vehicleRegistrationNumber: '', vehicleEngineSize: ''}

    this.sendNomination(nomination)
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
      let costs = this.buy == 1 ? this.grossAmount * 0.2 : 0
      this.toPay = (this.grossAmount - (Math.round(0.12 * (this.grossAmount - costs)))) + this.transportAmount * 1 //needed to not treat as string (love JS)
    }
  }

  private sendNomination(request: ConfirmedNomination) {
    this.http.post<any>(this.baseUrl + 'esor/nominations/' + this.matchId + '/confirm', request).subscribe({
      next: () => {
        this.isAccepted = true;
      },
      error: err => {
        console.log(err)
      }
    })
  }

  getIcal() {
    this.fileService.downloadIcal(this.nomination.matchId);
  }

  getDelegation() {
    this.fileService.downloadDelegationWithFilename(this.nomination.matchId, this.nomination.date + '-' + this.nomination.teamHome)
  }
}
