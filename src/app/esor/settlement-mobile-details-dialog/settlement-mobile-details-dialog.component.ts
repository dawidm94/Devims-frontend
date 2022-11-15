import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-settlement-mobile-details-dialog',
  templateUrl: './settlement-mobile-details-dialog.component.html',
  styleUrls: ['./settlement-mobile-details-dialog.component.css']
})
export class SettlementMobileDetailsDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<SettlementMobileDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public timetable: any
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.dialogRef.close(this.timetable)
  }
}
