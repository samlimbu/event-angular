import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuardService } from './core/auth-guard.service';
import { RoleGuard } from './core/role.guard';

const routes: Routes = [
  {
    path: 'event', loadChildren: () => import('./feature-module/event/event.module').then(m => m.EventModule), canActivate: [AuthGuardService, RoleGuard],
    data: {
      role: ['Admin', 'Moderator']
    }
  },
  { path: 'login', loadChildren: () => import('./feature-module/login/login.module').then(m => m.LoginModule) },
  { path: 'settings', loadChildren: () => import('./feature-module/settings/settings.module').then(m => m.SettingsModule) },
  {
    path: 'home', loadChildren: () => import('./feature-module/home/home.module').then(m => m.HomeModule),
    data: {
      role: ['Admin', 'Moderator','User']
    },
    canActivate: [AuthGuardService, RoleGuard]
  },
  {
    path: 'user_profile', loadChildren: () => import('./feature-module/user-profile/user-profile.module').then(m => m.UserProfileModule),
    canActivate: [AuthGuardService, RoleGuard],
    data: {
      role: ['Admin', 'Moderator','User']
    }
  },
  {
    path: 'form_event', loadChildren: () => import('./feature-module/add-event/add-event.module').then(m => m.AddEventModule),
    canActivate: [AuthGuardService, RoleGuard],
    data: {
      role: ['Admin', 'Moderator']
    }
  },
  {
    path: 'user_management', loadChildren: () => import('./feature-module/user-management/user-management.module').then(m => m.UserManagementModule),
    canActivate: [AuthGuardService, RoleGuard],
    data: {
      role: ['Admin', 'Moderator']
    }
  },
  {
    path: 'notification', loadChildren: () => import('./feature-module/notification/notification.module').then(m => m.NotificationModule),
    canActivate: [AuthGuardService, RoleGuard],
    data: {
      role: ['Admin']
    }
  },
  {
    path: 'category', loadChildren: () => import('./feature-module/category/category.module').then(m => m.CategoryModule),
    canActivate: [AuthGuardService, RoleGuard],
    data: {
      role: ['Admin', 'Moderator']
    }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // redirect to `first-component`
  //{ path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
