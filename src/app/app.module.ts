import { NgModule } from '@angular/core';
import {BrowserModule, Meta} from '@angular/platform-browser';
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
import {DateAdapter, MatNativeDateModule} from "@angular/material/core";

import { MAT_DATE_LOCALE } from '@angular/material/core'
import {MatDividerModule} from "@angular/material/divider";
import { NominationsComponent } from './esor/nominations/nominations.component';
import { RejectNominationDialogComponent } from './esor/reject-nomination-dialog/reject-nomination-dialog.component';
import { AcceptNominationDialogComponent } from './esor/accept-nomination-dialog/accept-nomination-dialog.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { EarningsComponent } from './esor/earnings/earnings.component';
import {CustomDateAdapter} from "./esor/custom.date.adapter";
import { SettlementsComponent } from './esor/settlements/settlements.component';
import { SettlementMobileDetailsDialogComponent } from './esor/settlement-mobile-details-dialog/settlement-mobile-details-dialog.component';
import { PhonebookComponent } from './esor/phonebook/phonebook.component';
import {MatPaginatorIntl, MatPaginatorModule} from "@angular/material/paginator";
import {getPolishPaginatorIntl} from "./esor/polish-paginator-init";
import {ClipboardModule} from "@angular/cdk/clipboard";
import { TimetableGeneralComponent } from './esor/timetable-general/timetable-general.component';
import {MatSelectModule} from "@angular/material/select";
import {MatExpansionModule} from "@angular/material/expansion";
import { TimetableGeneralAdvancedComponent } from './esor/timetable-general-advanced/timetable-general-advanced.component';
import { PreSeasonSurveyComponent } from './esor/pre-season-survey/pre-season-survey.component';
import {MatStepperModule} from "@angular/material/stepper";
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { MobileIconComponent } from './esor/mobile-icon/mobile-icon.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatRadioModule} from "@angular/material/radio";



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
    EarningsComponent,
    SettlementsComponent,
    SettlementMobileDetailsDialogComponent,
    PhonebookComponent,
    TimetableGeneralComponent,
    TimetableGeneralAdvancedComponent,
    PreSeasonSurveyComponent,
    PrivacyPolicyComponent,
    MobileIconComponent
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
    MatPaginatorModule,
    ClipboardModule,
    MatSelectModule,
    MatExpansionModule,
    MatStepperModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatRadioModule,
  ],
  providers: [
    Meta,
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    { provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE]},
    { provide: MatPaginatorIntl, useValue: getPolishPaginatorIntl()},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
