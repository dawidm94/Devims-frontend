import { Component, OnInit } from '@angular/core';
import {LogInDialogComponent} from "./log-in-dialog/log-in-dialog.component";
import {MatDialog} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FileService} from "./file.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {HttpService} from "./http.service";
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-esor',
  templateUrl: './esor.component.html',
  styleUrls: ['./esor.component.css']
})
export class EsorComponent implements OnInit {
  loggedIn = false;
  token: string | undefined;
  username: string | undefined;
  firstName: string | undefined;
  seasonId: number | undefined;
  baseUrl = environment.baseURL
  isBlankDelegationDownloading = false;
  mobile = window.screen.width < 900;
  gotBackendHealthResponse = false;
  showReleaseHistory = false;
  isHealthCheckError = false;
  loadingMessage = 'Uruchamianie aplikacji - prosimy o chwilę cierpliwości :)'
  loadingMessageList = [
    'Potwierdzanie meczów u referenta obsad',
    'Generowanie delegacji',
    'Sprawdzanie licencji',
    'Nadmuchiwanie piłki do kosza',
    'Włączanie CA70',
    'Zbieranie podpisów',
    'Wyliczanie dojazdów',
    'Sprawdzanie najbliższych meczów'
  ]
  nameClickCounter = 0;
  temporaryHiddenMobileIcon = false;
  showMobileIconHint = false;
  secretModeCounter = 0;

  constructor(
    private metaService: Meta,
    private titleService: Title,
    private http: HttpClient,
    public dialog: MatDialog,
    public fileService: FileService,
    public router: Router,
    public httpService: HttpService
  ) {
    this.titleService.setTitle("Devims - ESOR");
  }

  ngOnInit(): void {
    this.addTag();
    this.checkIfEsorTokenIsValid()

    if (this.router.url === '/esor') {
      this.router.navigate(['/esor/home'])
    }

    if (!this.loggedIn) {
      const requestOptions: Object = {
        responseType: 'text' as 'text'
      }

      this.http.get<any>(this.baseUrl + 'health', requestOptions).subscribe({
        next: () => {
          this.gotBackendHealthResponse = true;
        },
        error: () => {
          this.gotBackendHealthResponse = true;
          this.isHealthCheckError = true;
        }
      });
    }
    setInterval(() => this.switchLoadingMessage(), 7000);
  }

  switchLoadingMessage() {
    if (!this.gotBackendHealthResponse) {
      let number = Math.floor(Math.random() * this.loadingMessageList.length)
      this.loadingMessage = this.loadingMessageList[number]
    }
  }

  checkIfEsorTokenIsValid(): boolean {
    let esorToken = localStorage.getItem('jwt') as string

    if (esorToken) {

      this.http.get<any>(this.baseUrl + 'esor/me').subscribe({
        next: response => {
          this.loggedIn = true;
          this.username = response.username
          this.firstName = response.username.split(/(\s+)/)[0];
          this.showMobileIconHint = response.user.showMobileIconHint;
          this.updateSeasonId(esorToken)
          return true
        },
        error: () => {
          this.loggedIn = false;
        }
      })
    }
    return false
  }

  updateSeasonId(esorToken: string): void {
    this.http.get<any>(this.baseUrl + 'esor/seasons/current').subscribe({
      next: season => {sessionStorage.setItem('seasonId', season.id)},
      error: err => {console.log(err)}
    })
  }

  dontShowMobileIconHint(): void {
    this.temporaryHiddenMobileIcon = true;
    this.http.get<any>(this.baseUrl + 'esor/mobile-icon-hint').subscribe({})
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LogInDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.checkIfEsorTokenIsValid()
    });
  }

  logout() {
    localStorage.removeItem('jwt')
    this.router.navigate((['/esor']))
    window.location.reload();
  }

  gotToLink(url: string) {
    window.open(url, "_blank");
  }

  downloadBlankDelegation() {
    this.isBlankDelegationDownloading = true;
    this.http.get<any>(this.baseUrl + 'esor/blankets').subscribe({
      next: response => {
        let url = this.baseUrl + response[0].blanketLink.replace('/api', 'esor');
        this.fileService.downloadBlankDelegation(url, response[0].name);
        this.isBlankDelegationDownloading = false;
      },
      error: () => {this.isBlankDelegationDownloading = false}
    })
  }

  addNameClick() {
    this.nameClickCounter += 1;
  }

  addTag() {
    this.metaService.addTag({ name: 'description', content: 'Narzędzie do kompleksowego zarządzania nominacjami sędziowskimi z systemu ESOR - od ich akceptacji lub odrzucenia, po nawigację do hali, ewidencję zarobków i wiele innych.' });
  }

  secretTap() {
    this.secretModeCounter++;
  }
}
