import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-log-in-dialoge',
  templateUrl: './log-in-dialog.component.html',
  styleUrls: ['./log-in-dialog.component.css']
})
export class LogInDialogComponent {
  passwordHide = true;
  username: string | undefined;
  password: string | undefined;
  token: string | undefined;
  isEmptyInput = false;
  isLoginError = false;
  baseUrl = environment.baseURL;
  isLogging = false;
  isSlowLogging = false;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<LogInDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { token: string; },
  ) {}

  login() {
    this.isLogging = true;
    this.isEmptyInput = false;
    this.isSlowLogging = false;
    if (this.username === undefined || this.password === undefined) {
      this.isEmptyInput = true;
      return;
    }

    setTimeout(() => this.isSlowLogging = true, 4000)

    this.http.post(this.baseUrl + 'esor/login', {login: this.username, password: this.password}, { responseType: 'text' as 'text' })
      .subscribe({
        next: token => {
          sessionStorage.setItem('esorToken', token);
          this.isLoginError = false;
          this.isLogging = false;
          this.dialogRef.close()
        },
        error: err => {
          this.isLoginError = true
          this.isLogging = false;
        }
      })
  }
}
