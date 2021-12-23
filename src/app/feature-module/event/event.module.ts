import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventRoutingModule } from './event-routing.module';

import { SharedModule } from 'src/app/shared-ui/shared.module';
import { EventReportComponent } from './event-report/event-report.component';
import { EventComponent } from './event-component/event.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EventComponent,
    EventReportComponent
  ],
  imports: [
    CommonModule,
    EventRoutingModule,
    SharedModule,
    FormsModule 
  ]
})
export class EventModule { }
