import { ActivatedRoute } from '@angular/router';
import { EventDetailService } from 'src/app/services/event-detail.service';
import { EventService } from 'src/app/services/event.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { merge, of as observableOf, Subject, takeUntil } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationBoxComponent } from '../../../shared-ui/confirmation-box/confirmation-box.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-event-report',
  templateUrl: './event-report.component.html',
  styleUrls: ['./event-report.component.css']
})
export class EventReportComponent implements OnInit {
  subject$ = new Subject<void>();
  displayedColumns: string[] = ['first_name', 'username', 'email', 'response'];
  data: any = [];
  eventInfo: any = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  eventTitle = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private route: ActivatedRoute,
    private eventDetailService: EventDetailService,
    public dialog: MatDialog,
    public eventService: EventService,
    private router: Router
  ) { }

  ngOnInit(): void { 
  }
  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
  getEventInfo(id: number) {
    this.eventService.getDataById(id)
      .pipe(takeUntil(this.subject$)).subscribe({
        next: (data) => { this.eventInfo = data },
        error: (error) => { },
        complete: () => { console.log(this.eventTitle =this.eventInfo[0]['title'], this.eventInfo, this.eventInfo[0]['title']) }
      })
  }

  ngAfterViewInit() {
    this.route.queryParams.pipe(takeUntil(this.subject$)).subscribe(params => {
      console.log(params);
      if (params['id']) {
        this.loadTableData(params['id']);
        this.getEventInfo(params['id']);
      }
      else {
      }
    });
  }
  loadTableData(event_id: number) {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.pipe(takeUntil(this.subject$)).subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        takeUntil(this.subject$),
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.eventDetailService.getDataByEventId(
            event_id,
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          console.log(data);
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          // this.resultsLength = data.total_count;
          return data;
        }),
      )
      .subscribe(data => (this.data = data));

    this.eventService.getCount()
      .pipe(takeUntil(this.subject$)).subscribe(data => this.resultsLength = data);
  }
  edit(e: any) {
    console.log(e);
  }
  delete(e: any) {
    console.log(e);
  }

  openDialogDelete(e: any) {
    console.log(e);
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '265px',
      disableClose: false,
      data: { text: e.title, disabled: true, title: "Are you sure to delete?" }
    });

    dialogRef.componentInstance.buttonEvent.pipe(takeUntil(this.subject$)).subscribe(data => {
      console.log('delete event dialogue', data);
      if (data) {
        console.log('delete event dialogue', data);
        this.isLoadingResults = true;
        this.eventService.deleteById(e.id)
          .pipe(takeUntil(this.subject$)).subscribe({
            next: (data) => console.log(data),
            error: (error) => { },
            complete: () => [this.loadTableData(e.id), dialogRef.componentInstance.onNoClick()]
          })
      }
    })

  }
  openDialogEdit(e: any) {
    this.router.navigate(['/form_event'], { queryParams: { id: e.id } });
  }

  openReport(e: any) {
    this.router.navigate(['event/event_report'], { queryParams: { id: e.id } });
  }
  excl() {
    let data1 = this.data;
    var LIST = [];
    var Columns = {
      col0: 'event_id',
      col1: 'username',
      col2: 'first_name',
      col3: 'middle_name',
      col4: 'last_name',
      col5: 'email',
      col6: 'response',
    };
    console.log(data1[0]['parents']);
    LIST.push(Columns);
    for (var i = 0; i < data1.length; i++) {
      let obj = {
        col0: data1[i]['event_id'],
        col1: data1[i]['username'],
        col2: data1[i]['user_objid'][0]['first_name'],
        col3: data1[i]['user_objid'][0]['middle_name'],
        col4: data1[i]['user_objid'][0]['last_name'],
        col5: data1[i]['user_objid'][0]['email'],
        col6: data1[i]['response']
      }
      LIST.push(obj);
    }
    exportCSV(LIST);

    function exportCSV(EXCL: any) {

      var csv = EXCL.map(function (d: any) {
        return JSON.stringify(Object.values(d));
      })
        .join('\n')
        .replace(/(^\[)|(\]$)/mg, '');
      console.log(csv);
      var link = window.document.createElement("a");
      link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csv));
      link.setAttribute("download", "upload_data.csv");
      link.click();
    }
  }
}
