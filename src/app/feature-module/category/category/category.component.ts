import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { merge, of as observableOf, Subject, takeUntil } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationBoxComponent } from '../../../shared-ui/confirmation-box/confirmation-box.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  subject$ = new Subject<void>();
  displayedColumns: string[] = ['name','detail','edit'];
  data: any = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    public categoryService: CategoryService,
    private router: Router,
    private authSerivice: AuthService
  ) { }
  ngOnInit() { }
  ngAfterViewInit() {
    this.loadTableData();
    if(this.authSerivice.getUserProfile().roles[0]!='Admin'){
      this.displayedColumns = ['name', 'detail']
    }
  }
  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
  loadTableData() {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.pipe(takeUntil(this.subject$)).subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(takeUntil(this.subject$),
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.categoryService.getDatabyQuery(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            {file: 0}
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

    this.categoryService.getCount()
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
        // this.categoryService.deleteById(e.id)
        //   .pipe(takeUntil(this.subject$)).subscribe({
        //     next: (data) => console.log(data),
        //     error: (error) => { },
        //     complete: () => [this.loadTableData(), dialogRef.componentInstance.onNoClick()]
        //   })
      }
    })

  }
  openDialogEdit(e: any) {
    console.log(e);
    this.router.navigate(['/category/add'], { queryParams: { id: e._id } });
  }

  openReport(e: any) {
    this.router.navigate(['event/event_report'], { queryParams: { id: e.id } });
  }

}
