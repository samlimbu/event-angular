import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { routes } from '../../consts/routes';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  public routes: typeof routes = routes;
  public isOpenUiElements = false;
  panelOpenState = false;
  public openUiElements() {
    this.isOpenUiElements = !this.isOpenUiElements;
  }
  constructor(
    private authService: AuthService,
    private router: Router,
    private appService: AppService
  ){}

  onLogOut(){
    this.authService.logout();
    this.router.navigate(['login']);
  }
  ngOninit(){
  
  }
  getExpandState(){
    return this.appService.isPanelExpanded();
  }
  setPanelState(state: boolean){
    this.appService.setPanelState(state);
  }

}
