import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { catchError, map, merge, startWith, switchMap, of as observableOf, Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ConfirmationBoxComponent } from 'src/app/shared-ui/confirmation-box/confirmation-box.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = ['first_name', 'username', 'email', 'roles', 'edit_role', 'reset_password', 'delete'];
  data: any = [];
  searchText = '';
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  subject$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('SearchBox') searchBox!: any;
  constructor(
    public dialog: MatDialog,
    public userService: UserService,
    private router: Router
  ) { }
  ngOnInit() { }
  ngAfterViewInit() {
    this.loadTableData();
  }
  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
  changeSearchText(e: any) {
    this.searchText = e;

  }
  loadTableData() {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.pipe(takeUntil(this.subject$)).subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page, this.searchBox.textChange)
      .pipe(
        takeUntil(this.subject$),
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.userService.getDatabyQuery(
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
      .subscribe(data => (this.data = data));

    this.userService.getCount()
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
      data: { text: e.username, disabled: true, title: "Are you sure to delete ?" }
    });

    dialogRef.componentInstance.buttonEvent.pipe(takeUntil(this.subject$))
    .subscribe(data => {
      console.log('delete event dialogue', data);
      if (data) {
        console.log('delete event dialogue', data);
        this.isLoadingResults = true;
        this.userService.deleteByUsername(e.username)
          .pipe(takeUntil(this.subject$)).subscribe({
            next: (data) => console.log(data),
            error: (error) => { },
            complete: () => [this.loadTableData(), dialogRef.componentInstance.onNoClick()]
          })
      }
    })

  }

  openDialogReset(e: any) {
    console.log(e);
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '265px',
      disableClose: false,
      data: { text: '', disabled: false, title: "Enter New Password" }
    });

    dialogRef.componentInstance.buttonEvent.pipe(takeUntil(this.subject$)).subscribe(data => {
      console.log('event dialogue', data);
      if (data) {
        console.log('event dialogue', data.text);
        this.isLoadingResults = true;
        let obj = e;
        e.password = data.text;
        this.userService.resetPassword(obj)
          .pipe(takeUntil(this.subject$)).subscribe({
            next: (data) => console.log(data),
            error: (error) => { },
            complete: () => [this.loadTableData(), dialogRef.componentInstance.onNoClick()]
          })
      }
    })

  }

  openDialogEditRole(e: any) {
    console.log('......', e);
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '265px',
      disableClose: false,
      data: {
        text: null,
        disabled: false,
        title: "Change role",
        isDropDown: true,
        dropdownLIST: [
          { value: 'Admin', viewValue: 'Admin' },
          { value: 'Moderator', viewValue: 'Moderator' },
          { value: 'User', viewValue: 'User' }
        ],
        dropdownSelected: e.roles[0]
      }
    });

    dialogRef.componentInstance.buttonEvent.pipe(takeUntil(this.subject$)).subscribe(data => {
      console.log('event dialogue', data);
      if (data) {
        console.log('event dialogue', data.text);
        this.isLoadingResults = true;
        let obj = e;
        obj.roles = [`${data.text}`];
        console.log(obj);
        this.userService.changeRole(obj)
          .pipe(takeUntil(this.subject$)).subscribe({
            next: (data) => console.log(data),
            error: (error) => { },
            complete: () => [this.loadTableData(), dialogRef.componentInstance.onNoClick()]
          })
      }
    })
  }
  openDialogEdit(e: any) {
    this.router.navigate(['/form_event'], { queryParams: { id: e.id } });
  }

}