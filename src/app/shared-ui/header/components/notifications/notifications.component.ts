import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/services/app-config.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SseService } from 'src/app/services/sse.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(
    private notificationService: NotificationService
  ) {

  }
  ngOnInit(): void {

  }
  onClear() {
    this.notificationService.clearList();
  }
  getList(): any[] {
    return this.notificationService.getList();
  }
  onNotificationClick() {
    this.notificationService.onNotificationClick();
  }
  getSeenCount() {
    return this.notificationService.getSeenCount();
  }
}
