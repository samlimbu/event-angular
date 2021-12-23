import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfileComponent } from './user-profile-component/user-profile.component';
import { SharedModule } from 'src/app/shared-ui/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class UserProfileModule { }
