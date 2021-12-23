import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class EventDetailService {
  url = `${this.appConfigService.config['api_url']}/event_detail`;
  constructor(private http: HttpClient, private appConfigService: AppConfigService) { }

  getAllData() {
    return this.http.get(`${this.url}/all`);
  }

  addData(obj: any) {
    console.log(obj);
    return this.http.post(`${this.url}/add`, obj)
  }

  getDatabyUsername(username: any) {
    const requestUrl = `${this.url}/username/${username}`;
    return this.http.get<any>(requestUrl);
  }

  getDatabyQuery(sortby: string, order: string, page: number, pageSize: number): Observable<any> {
    console.log(sortby, order, page, pageSize)
    const requestUrl = `${this.url}?sortby=${sortby}&order=${order}&page=${page + 1
      }&pageSize=${pageSize + 0}`;

    console.log(requestUrl)
    return this.http.get<any>(requestUrl);
  }
  getCount() {
    const requestUrl = `${this.url}/count`;
    console.log(requestUrl)
    return this.http.get<any>(requestUrl);
  }

  getDataById(id: number): Observable<Object> {
    return this.http.get(`${this.url}/id/${id}`);
  }
  getDataByEventId(id: number, sortby: string, order: string, page: number, pageSize: number): Observable<Object> {
    const requestUrl = `?sortby=${sortby}&order=${order}&page=${page + 1
    }&pageSize=${pageSize + 0}`;
    return this.http.get(`${this.url}/event_id/${id}${requestUrl}`);
  }
  getAllDataByEventId(id: number){
    return this.http.get(`${this.url}/event_id/all/${id}`);
  }
  deleteById(id: number): Observable<Object> {
    return this.http.post(`${this.url}/delete`, { id: id })
  }
  update(id: number, obj: any): Observable<Object> {
    return this.http.put(`${this.url}/update/${id}`, obj)
  }
}
