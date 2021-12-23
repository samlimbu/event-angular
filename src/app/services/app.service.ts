import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
isExpanded = false;
  constructor() { }

  setPanelState(state:boolean){
    this.isExpanded = state;
  }
  isPanelExpanded(){
    return this.isExpanded;
  }
}
