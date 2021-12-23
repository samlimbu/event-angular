import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public lat: any;
  public lng: any;
  private messageSource = new Subject<any>();
  private coordinateLIST = new Subject<any>();
  private mapcoordinateLIST = new Subject<any>();
  constructor() {
    let i = 0;
    setInterval(() => {
      this.changeMessage(i);
      i++;
    }, 1000)
  }
  changeMessage(message: string|number) {
    this.messageSource.next(message);
  }
  getMessage() {
    return this.messageSource.asObservable();
  }

  setCoordinateLIST(LIST: any) {
    this.coordinateLIST.next(LIST);
  }

  getCoordinateLIST(): Observable<any> {
    return this.coordinateLIST.asObservable();
  }

  setMapCoordinateLIST(LIST: any) {
    this.mapcoordinateLIST.next(LIST);
  }
  getMapCoordinateLIST() {
    return this.mapcoordinateLIST.asObservable();
  }

  getPosition(callback: any) {
    console.log('serveice get positoin')
    window.navigator.geolocation.getCurrentPosition(position => {
      callback(position)
    });
  }
}
