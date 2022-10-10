import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { HomeComponent } from './home/home.component';
import { EsorComponent } from './esor/esor.component';
import { LogInDialogComponent } from './esor/log-in-dialog/log-in-dialog.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BusyTimesComponent } from './esor/busy-times/busy-times.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from "@angular/material/table";
import { PeriodicallyComponent } from './esor/periodically/periodically.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { DeleteAllComponent } from './esor/delete-all/delete-all.component';
import { TimetableComponent } from './esor/timetable/timetable.component';
import {MatSortModule} from "@angular/material/sort";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { MatchDetailsDialogComponent } from './esor/match-details-dialog/match-details-dialog.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import { EsorHomeComponent } from './esor/esor-home/esor-home.component';
import { SinglePeriodComponent } from './esor/single-period/single-period.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";

import { MAT_DATE_LOCALE } from '@angular/material/core'
import {MatDividerModule} from "@angular/material/divider";
import { NominationsComponent } from './esor/nominations/nominations.component';
import { RejectNominationDialogComponent } from './esor/reject-nomination-dialog/reject-nomination-dialog.component';
import { AcceptNominationDialogComponent } from './esor/accept-nomination-dialog/accept-nomination-dialog.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { EarningsComponent } from './esor/earnings/earnings.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EsorComponent,
    LogInDialogComponent,
    BusyTimesComponent,
    PeriodicallyComponent,
    DeleteAllComponent,
    TimetableComponent,
    MatchDetailsDialogComponent,
    EsorHomeComponent,
    SinglePeriodComponent,
    NominationsComponent,
    RejectNominationDialogComponent,
    AcceptNominationDialogComponent,
    EarningsComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSliderModule,
        MatGridListModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatSidenavModule,
        FormsModule,
        HttpClientModule,
        MatTableModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatMenuModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatNativeDateModule,
        MatDividerModule,
        MatTooltipModule,
    ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pl-PL' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
