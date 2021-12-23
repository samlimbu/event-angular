import { Directive, OnInit, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({ selector: '[appUserRole]' })
export class UserRoleDirective implements OnInit {
  constructor(
    private templateRef: TemplateRef<any>,
    private authService: AuthService,
    private viewContainer: ViewContainerRef
  ) { }

  userRoles: any[] = [];

  @Input()
  set appUserRole(roles: any[]) {
    if (!roles || !roles.length) {
      throw new Error('Roles value is empty or missed');
    }
    this.userRoles = roles;
  }

  ngOnInit() {
    let hasAccess = false;
   // console.log(this.authService.getUserProfile()['roles'], this.userRoles);
    // if (this.authService.isAuthorized() && this.userRoles) {
    //     hasAccess = this.userRoles.some(r => this.authService.hasRole(r));
    // }
    this.userRoles.forEach((element: any) => {
     // console.log(this.authService.getUserProfile()['roles'], this.userRoles)
      if (this.authService.getUserProfile()['roles'].includes(element)) {
         hasAccess = true;
      }
    });

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
