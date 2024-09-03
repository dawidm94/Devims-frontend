import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {EsorComponent} from "./esor/esor.component";
import {BusyTimesComponent} from "./esor/busy-times/busy-times.component";
import {PeriodicallyComponent} from "./esor/periodically/periodically.component";
import {DeleteAllComponent} from "./esor/delete-all/delete-all.component";
import {EsorHomeComponent} from "./esor/esor-home/esor-home.component";
import {TimetableComponent} from "./esor/timetable/timetable.component";
import {SinglePeriodComponent} from "./esor/single-period/single-period.component";
import {NominationsComponent} from "./esor/nominations/nominations.component";
import {EarningsComponent} from "./esor/earnings/earnings.component";
import {SettlementsComponent} from "./esor/settlements/settlements.component";
import {PhonebookComponent} from "./esor/phonebook/phonebook.component";
import {TimetableGeneralComponent} from "./esor/timetable-general/timetable-general.component";
import {
  TimetableGeneralAdvancedComponent
} from "./esor/timetable-general-advanced/timetable-general-advanced.component";
import {PreSeasonSurveyComponent} from "./esor/pre-season-survey/pre-season-survey.component";
import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";
import {MobileIconComponent} from "./esor/mobile-icon/mobile-icon.component";
import {TestComponent} from "./esor/test/test.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'privacy-policy', component: PrivacyPolicyComponent
  },
  {
    path: 'survey', component: PreSeasonSurveyComponent
  },
  {
    path: 'test', component: TestComponent
  },
  {
    path: 'esor',
    component: EsorComponent,
    children : [
      {
        path: 'busy-times', component: BusyTimesComponent,
      },
      {
        path: 'periodically', component: PeriodicallyComponent
      },
      {
        path: 'delete-all', component: DeleteAllComponent
      },
      {
        path: 'timetable', component: TimetableComponent
      },
      {
        path: 'timetable-general', component: TimetableGeneralComponent
      },
      {
        path: 'timetable-general-advanced', component: TimetableGeneralAdvancedComponent
      },
      {
        path: 'home', component: EsorHomeComponent
      },
      {
        path: 'period', component: SinglePeriodComponent
      },
      {
        path: 'nominations', component: NominationsComponent
      },
      {
        path: 'earnings', component: EarningsComponent
      },
      {
        path: 'settlements', component: SettlementsComponent
      },
      {
        path: 'phonebook', component: PhonebookComponent
      },
      {
        path: 'pre-season-survey', component: PreSeasonSurveyComponent
      },
      {
        path: 'mobile-icon', component: MobileIconComponent
      }
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
