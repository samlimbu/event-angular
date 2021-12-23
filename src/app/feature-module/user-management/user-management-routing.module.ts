import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadUsersComponent } from './upload-users/upload-users.component';
import { UserManagementComponent } from './user-management/user-management.component';

const routes: Routes = [
  {path:'', component: UserManagementComponent},
  {path:'upload_users', component: UploadUsersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
