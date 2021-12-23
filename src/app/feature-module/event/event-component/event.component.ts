import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { merge, of as observableOf, Subject, takeUntil } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from 'src/app/services/event.service';
import { ConfirmationBoxComponent } from '../../../shared-ui/confirmation-box/confirmation-box.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  subject$=new Subject<void>();
  displayedColumns: string[] = ['date', 'title', 'createdOn', 'category', 'report', 'edit', 'delete'];
  data: any = [];
  searchText = '';

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('SearchBox') searchBox!: any;

  constructor(
    public dialog: MatDialog,
    public eventService: EventService,
    private router: Router,
    private authSerivice: AuthService
  ) { }
  ngOnInit() {
  
  }

  ngAfterViewInit() {
    this.searchLoadTableData();
    if (this.authSerivice.getUserProfile().roles[0] != 'Admin') {
      this.displayedColumns = ['date', 'title', 'createdOn', 'category', 'report', 'edit']
    }
  }

  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
  changeSearchText(e:any){
    this.searchText = e;

  }

  searchLoadTableData() {
    this.sort.sortChange.pipe(takeUntil(this.subject$)).subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page, this.searchBox.textChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.eventService.searchData(
            this.searchText,
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
      .pipe(takeUntil(this.subject$)).subscribe(data => (this.data = data));

    this.eventService.getCount()
      .pipe(takeUntil(this.subject$)).subscribe(data => this.resultsLength = data);
  }

  // loadTableData() {
  //    this.sort.sortChange.pipe(takeUntil(this.subject$)).subscribe(() => (this.paginator.pageIndex = 0));
  //   merge(this.sort.sortChange, this.paginator.page)
  //     .pipe(
  //       startWith({}),
  //       switchMap(() => {
  //         this.isLoadingResults = true;
  //         return this.eventService.getDatabyQuery(
  //           this.sort.active,
  //           this.sort.direction,
  //           this.paginator.pageIndex,
  //           this.paginator.pageSize
  //         ).pipe(catchError(() => observableOf(null)));
  //       }),
  //       map(data => {
  //         console.log(data);
  //         this.isLoadingResults = false;
  //         this.isRateLimitReached = data === null;
  //         if (data === null) {
  //           return [];
  //        }
  //         return data;
  //       })
  //     )
  //     .pipe(takeUntil(this.subject$)).subscribe(data => (this.data = data));

  //   this.eventService.getCount()
  //     .pipe(takeUntil(this.subject$)).subscribe(data => this.resultsLength = data);
  // }
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
            complete: () => [this.searchLoadTableData(), dialogRef.componentInstance.onNoClick()]
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
}



