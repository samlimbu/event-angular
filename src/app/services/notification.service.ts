import { isDataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { SseService } from './sse.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  LIST: any = [];
  seenCount = 0;

  constructor(
    private sseService: SseService,
    private appConfigService: AppConfigService
  ) {
    this.getEvents();
  }
  getEvents() {
    this.sseService.getServerSentEvent(`${this.appConfigService.config['api_url']}/sse/`)
      .subscribe({
        next: (next) => {
          console.log(next.data)
          let data: any = JSON.parse(next['data']);
          this.LIST=data;
        }
      })
  }
  clearList() {
    this.LIST = [];
    this.seenCount = 0;
  }

  getList() {
    return this.LIST;
  }

  onNotificationClick() {
    this.seenCount = this.LIST.length;
  }
  getSeenCount() {
    return this.seenCount;
  }
}
