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

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
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
      }
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
