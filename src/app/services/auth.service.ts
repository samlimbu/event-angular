import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AppConfigService } from './app-config.service';
import { JwtHelperService } from '@auth0/angular-jwt';
const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService
    ){
    }


  getTestData() {
    return this.http.get(`${this.appConfigService.config['api_url']}/category`)
      .pipe(map(data => {
        console.log(data)
      }));
  }
  
  authenticateUser(user: any) {
    console.log(this.appConfigService.config['api_url']);
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    return this.http.post(`${this.appConfigService.config['api_url']}/user/authenticate`, user)
      .pipe(map(data => { return data }));
  }

  getProfile(data: any) {
    return this.http.post(`${this.appConfigService.config['api_url']}/user/profile`,data)
      .pipe(map(data => { return data }));
  }

  storeUserData(token: any, user: any) {
    localStorage.setItem('token', token);
    this.authToken = token;
  }
  getUserProfile(){
    return this.getCurrentUser(this.getToken())['data'];
  }
  getToken() {
    return localStorage.getItem('token') as string;
  }
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }
  isTokenExpired(): boolean {
    if (localStorage.getItem('token')) {
      console.log(helper.isTokenExpired(localStorage.getItem('token')as string));
      return (helper.isTokenExpired(localStorage.getItem('token')as string));
      // return false;
      //isTokenExpired = this.helper.isTokenExpired();
    } else {
      return true;
    }
  }
  logout() {
    console.log('logout');
    this.authToken = null;
    localStorage.clear();
  }
  private getCurrentUser(token:string):any{
    return JSON.parse(atob(token.split('.')[1]));
  }
}
