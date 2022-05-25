import { Component, OnInit } from '@angular/core';
import {LogInDialogComponent} from "./log-in-dialog/log-in-dialog.component";
import {MatDialog} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FileService} from "./file.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {HttpService} from "./http.service";

@Component({
  selector: 'app-esor',
  templateUrl: './esor.component.html',
  styleUrls: ['./esor.component.css']
})
export class EsorComponent implements OnInit {
  loggedIn = false;
  token: string | undefined;
  username: string | undefined;
  seasonId: number | undefined;
  upcomingMatch: any | undefined;
  upcomingMatchId: number | undefined;
  baseUrl = environment.baseURL
  isBlankDelegationDownloading = false;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public fileService: FileService,
    public router: Router,
    public httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.checkIfEsorTokenIsValid()
    if (this.router.url === '/esor') {
      this.router.navigate(['/esor/home'])
    }
    if (!this.loggedIn) {
      this.http.get<any>(this.baseUrl + 'health').subscribe(value => console.log(value))
    }
  }

  checkIfEsorTokenIsValid(): boolean {
    let esorToken = sessionStorage.getItem('esorToken') as string

    if (esorToken) {
      let headers = new HttpHeaders({'Esor-Token': esorToken });

      this.http.get<any>(this.baseUrl + 'esor/me', {headers: headers}).subscribe({
        next: response => {
          this.loggedIn = true;
          this.username = response.username
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
    let headers = new HttpHeaders({'Esor-Token': esorToken });
    this.http.get<any>(this.baseUrl + 'esor/seasons/current', {headers: headers}).subscribe({
      next: season => {sessionStorage.setItem('seasonId', season.id)},
      error: err => {console.log(err)}
    })
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LogInDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.checkIfEsorTokenIsValid()
    });
  }

  logout() {
    sessionStorage.removeItem('esorToken')
    this.router.navigate((['/esor']))
    window.location.reload();
  }

  gotToLink(url: string) {
    window.open(url, "_blank");
  }

  downloadBlankDelegation() {
    this.isBlankDelegationDownloading = true;
    this.http.get<any>(this.baseUrl + 'esor/blankets', this.httpService.getOptionWithEsorToken()).subscribe({
      next: response => {
        console.log(response)
        let url = this.baseUrl + response[0].blanketLink.replace('/api', 'esor');
        this.fileService.downloadBlankDelegation(url, response[0].name);
        this.isBlankDelegationDownloading = false;
      },
      error: () => {this.isBlankDelegationDownloading = false}
    })
  }
}
