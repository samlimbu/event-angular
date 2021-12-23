import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
  ) { }

  getAllData():Observable<any> {
    return this.http.get(`${this.appConfigService.config['api_url']}/category/all?file=0`);
  }
  getAllDatawithFile() {
    return this.http.get(`${this.appConfigService.config['api_url']}/category/all_fields`);
  }
  getDataById(id: number): Observable<Object>{
    return this.http.get(`${this.appConfigService.config['api_url']}/category/id/${id}`);
  }
  addData(obj: any):Observable<any> {
    console.log(obj);
    return this.http.post(`${this.appConfigService.config['api_url']}/category/add`, obj)
  }
  update(id: number, obj: any):Observable<any>{
    return this.http.put(`${this.appConfigService.config['api_url']}/category/update/${id}`, obj)
  }

  getDatabyQuery(sortby: string, order: string, page: number, pageSize: number, field:{}): Observable<any> {
    console.log(sortby, order, page, pageSize)
    const requestUrl = `${this.appConfigService.config['api_url']}/category?sortby=${sortby}&order=${order}&page=${page + 1
      }&pageSize=${pageSize + 0}&field=${field}`;

    console.log(requestUrl)
    return this.http.get<any>(requestUrl);
  }

  getCount() {
    const requestUrl = `${this.appConfigService.config['api_url']}/category/count`;
    console.log(requestUrl)
    return this.http.get<any>(requestUrl);
  }
}
