import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { SharedModule } from 'src/app/shared-ui/shared.module';
import { UploadUsersComponent } from './upload-users/upload-users.component';
import { UploadUsersDialogComponent } from './upload-users-dialog/upload-users-dialog.component';


@NgModule({
  declarations: [
    UserManagementComponent,
    UploadUsersComponent,
    UploadUsersDialogComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SharedModule,
    MatTableModule
  ]
})
export class UserManagementModule { }
