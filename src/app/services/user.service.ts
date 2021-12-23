import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
  ) { }

  registerUser(user: any) {

    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    return this.http.post(`${this.appConfigService.config['api_url']}/user/register`, user)
  }
  updateUser(user:any):Observable<any>{
    return this.http.post(`${this.appConfigService.config['api_url']}/user/update_user`, user)
  }

  getDatabyQuery(searchText: any, sortby: string, order: string, page: number, pageSize: number): Observable<any> {
    const requestUrl = `${this.appConfigService.config['api_url']}/user?sortby=${sortby}&order=${order}&page=${page + 1
      }&pageSize=${pageSize + 0}&q=${searchText}`;
    return this.http.get<any>(requestUrl)
    
  }

  getUserProfile(obj:any):Observable<Object>{
    return this.http.post(`${this.appConfigService.config['api_url']}/user/profile`, obj)
  }

  getCount() {
    const requestUrl = `${this.appConfigService.config['api_url']}/user/count`;
    return this.http.get<any>(requestUrl);
  }
  deleteById(id: number): Observable<Object> {
    return this.http.post(`${this.appConfigService.config['api_url']}/user/delete`, { id: id })
  }
  deleteByUsername(username: string): Observable<Object> {
    return this.http.post(`${this.appConfigService.config['api_url']}/user/delete`, { username: username })
  }
  resetPassword(obj: any): Observable<Object> {
    return this.http.post(`${this.appConfigService.config['api_url']}/user/reset_password`, obj)
  }
  insertMany(obj: any): Observable<Object> {
    return this.http.post(`${this.appConfigService.config['api_url']}/user/insert_many`, obj)
  }

  changeRole(obj: any): Observable<Object> {
    return this.http.post(`${this.appConfigService.config['api_url']}/user/change_role`, obj)
  }
  changePassword(obj: any): Observable<Object> {
    return this.http.post(`${this.appConfigService.config['api_url']}/user/change_password`, obj)
  }
}
