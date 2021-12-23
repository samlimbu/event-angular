import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryChoiceComponent } from './category-choice/category-choice.component';
import { HomeComponent } from './home-component/home.component';

const routes: Routes = [
  {path:'',component:CategoryChoiceComponent},
  {path:'event', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
