import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EventDetailService } from 'src/app/services/event-detail.service';
import { EventService } from 'src/app/services/event.service';
import { EventDetailComponent } from '../event-detail/event-detail.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  LIST: any;
  USEREVENTLIST: any;
  subject$ = new Subject<void>();
  constructor(
    private eventService: EventService,
    private eventDetailService: EventDetailService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }


  ngOnInit(): void {

    this.route.queryParams.pipe(takeUntil(this.subject$)).subscribe(params => {
      console.log(params);
      if (params['id']) {
        this.getEventByCategoryId(params['id']);
      } else {
        this.getAllEvents();
      }
    });
  }
  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
  getAllEvents() {
    this.eventService.getAllData()

      .pipe(takeUntil(this.subject$)).subscribe({
        next: (data) => [this.LIST = data, console.log(data)],
        error: (e) => console.error(e),
        complete: () => this.getUserEvent()
      })
  }

  getEventByCategoryId(id: any) {
    this.eventService.getDataByCategory(id)
      .pipe(takeUntil(this.subject$)).subscribe({
        next: (data) => [this.LIST = data, console.log(data)],
        error: (e) => console.error(e),
        complete: () => this.getUserEvent()
      })
  }

  getUserEvent() {
    this.eventDetailService.getDatabyUsername(this.authService.getUserProfile()['username'])
      .pipe(takeUntil(this.subject$)).subscribe({
        next: (data) => this.USEREVENTLIST = data,
        error: (e) => console.error(e),
        complete: () => console.info('complete')
      })
  }

  onClick(e: any, category: any) {
    console.log(e);
    console.log(this.authService.getUserProfile()._id)
    this.eventDetailService.addData(
      {
        id: "", event_id: e.data.id,title:e.data.title, username: this.authService.getUserProfile()['username'], user_objid: [`${this.authService.getUserProfile()._id}`],
        response: e.action
      })
      .pipe(takeUntil(this.subject$)).subscribe({
        next: (data) => [this.USEREVENTLIST = data,console.log(data)],
        error: (e) => console.error(e),
        complete: () => console.info('complete')
      })
  }

  onDetail(e:any){
    console.log(e);
    
      const dialogRef = this.dialog.open(EventDetailComponent, {
        data: e,
        minWidth: '90%'
      });
  
      dialogRef.afterClosed().pipe(takeUntil(this.subject$)).subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
 
}
