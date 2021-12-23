import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor(
    private _zone: NgZone,
    private appConfigService: AppConfigService,
    private http: HttpClient
  ) { }

  getEventSource(url:string): EventSource{
    return new EventSource(url);
  }

  getServerSentEvent(url: string){
    return new Observable<any>((observer) => {
      const eventSource = this.getEventSource(url);

      eventSource.onmessage = event =>{
        this._zone.run(()=>{
          observer.next(event);
        })
      }

      eventSource.onerror = error =>{
        this._zone.run(()=>{
          observer.error(error);
        })
      }
    });
  }

  setSSEMessage(obj:any){
    return this.http.post(`${this.appConfigService.config['api_url']}/sse/send_message`, obj)
  }
}
