import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home-component/home.component';
import {MatButtonModule} from '@angular/material/button';
import { EventCardComponent } from './event-card/event-card.component';
import { SharedModule } from 'src/app/shared-ui/shared.module';
import { CategoryChoiceComponent } from './category-choice/category-choice.component';
import { CategoryChoiceCardComponent } from './category-choice-card/category-choice-card.component';

import { MapModule } from 'src/app/shared-ui/map/map.module';
import { EventDetailComponent } from './event-detail/event-detail.component';

@NgModule({
  declarations: [HomeComponent, EventCardComponent, CategoryChoiceComponent, CategoryChoiceCardComponent, EventDetailComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatButtonModule,
    SharedModule,
    MapModule
  ]
})
export class HomeModule { }
