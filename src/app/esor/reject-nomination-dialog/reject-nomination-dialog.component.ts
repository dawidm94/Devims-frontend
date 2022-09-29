import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {HttpService} from "../http.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-reject-nomination-dialog',
  templateUrl: './reject-nomination-dialog.component.html',
  styleUrls: ['./reject-nomination-dialog.component.css']
})
export class RejectNominationDialogComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<RejectNominationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public matchId: number,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
  }

  baseUrl = environment.baseURL

  closeDialog(): void {
    this.dialogRef.close(false)
  }

  rejectNomination(): void {
    this.http.post<any>(this.baseUrl + 'esor/nominations/' + this.matchId + '/reject', this.httpService.getOptionWithEsorToken()).subscribe({
      next: () => {
        this.dialogRef.close(true)
      },
      error: err => {
        console.log(err)
      }
    })
  }

}
