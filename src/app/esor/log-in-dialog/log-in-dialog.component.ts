import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";

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

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<LogInDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { token: string; },
  ) {}

  login() {
    this.isEmptyInput = false;
    if (this.username === undefined || this.password === undefined) {
      this.isEmptyInput = true;
      return;
    }

    this.http.post('http://localhost:8080/esor/login', {login: this.username, password: this.password}, { responseType: 'text' as 'text' })
      .subscribe({
        next: token => {
          sessionStorage.setItem('esorToken', token);
          this.isLoginError = false;
          this.dialogRef.close()
        },
        error: err => {
          this.isLoginError = true
          console.log(err)
        }
      })
  }
}
