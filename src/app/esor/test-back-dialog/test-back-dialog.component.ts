import { Component } from '@angular/core';

@Component({
  selector: 'confirmation-dialog',
  template: `
    <h1 mat-dialog-title>Potwierdzenie</h1>
    <div mat-dialog-content>Czy na pewno chcesz opuścić tę stronę?</div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Nie</button>
      <button mat-button [mat-dialog-close]="'yes'">Tak</button>
    </div>
  `,
})
export class TestBackDialogComponent {
  constructor() {}

  onNoClick(): void {
  }
}
