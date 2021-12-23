import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  url = `${this.appConfigService.config['api_url']}/event`;
  constructor(private http: HttpClient, private appConfigService: AppConfigService) { }
  searchData(searchText: any, sortby: string, order: string, page: number, pageSize: number): Observable<any> {
    const requestUrl = `${this.url}/search?sortby=${sortby}&order=${order}&page=${page + 1
      }&pageSize=${pageSize + 0}`;
    return this.http.get(`${requestUrl}&q=${searchText}`);
  }
  getAllData() {
    return this.http.get(`${this.url}/all`);
  }

  getDataByCategory(id: number) {
    return this.http.get(`${this.url}/by_category_id/${id}`);
  }

  addData(obj: any, id: any) {
    console.log(obj);
    return this.http.post(`${this.url}/add`, obj)
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

  deleteById(id: number): Observable<Object> {
    return this.http.post(`${this.url}/delete`, { id: id })
  }
  update(id: number, obj: any): Observable<Object> {
    return this.http.put(`${this.url}/update/${id}`, obj)
  }

}
