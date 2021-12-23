import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventComponent } from './event-component/event.component';
import { EventReportComponent } from './event-report/event-report.component';

const routes: Routes = [
  {path:'',component:EventComponent},
  {path:'event_report', component:EventReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
