import { Component, EventEmitter, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import  { exportCSV }  from '../../../shared-ui/functions/functions'

@Component({
  selector: 'app-upload-users-dialog',
  templateUrl: './upload-users-dialog.component.html',
  styleUrls: ['./upload-users-dialog.component.css']
})
export class UploadUsersDialogComponent implements OnInit {
  displayedColumns!: any[];
  headings!: any[];
  @ViewChild(MatTable) table!: MatTable<any>;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  buttonEvent: EventEmitter<any> = new EventEmitter();
  showReportButton = false;
  isButtonDisable = false;
  constructor(
    public dialogRef: MatDialogRef<UploadUsersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataSource = new MatTableDataSource(data.data);
    // this.displayedColumns = [{key:'first_name',name:'First Name'}, {key:'email',name:'Email'}, {key:'username',name:'Username'},{key:'password',name:'Password'}];
    this.displayedColumns = ['first_name', 'last_name','email', 'username','roles', 'password'];
    this.headings = ['First Name', 'Last Name','Email', 'Username', 'Roles','Password'];
  }
  ngOnInit() {
    console.log(this.data);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  onClick(): void {
    this.isButtonDisable = true;
    this.buttonEvent.emit(true);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  updateData() {
    this.dataSource = new MatTableDataSource(this.data.data);
    this.displayedColumns = ['first_name', 'email', 'username', 'errmsg'];
    this.headings = ['First Name', 'Email', 'Username', 'Error'];
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.table.renderRows();
 
  }
  excl() {
    let data1 = this.data.data;
     var LIST = [];
    var Columns = {
      col0: 'first_name',
      col1: 'middle_name',
      col2: 'last_name',
      col3: 'username',
      col4: 'email',
      col5: 'roles',
      col6: 'errmsg',
    };
    console.log(data1[0]['parents']);
    LIST.push(Columns);
    for (var i = 0; i < data1.length; i++) {
      let obj = {
        col0: data1[i]['first_name'],
        col1: data1[i]['middle_name'],
        col2: data1[i]['last_name'],
        col3: data1[i]['username'],
        col4: data1[i]['email'],
        col5: data1[i]['roles'][0],
        col6: data1[i]['errmsg']
      }
      LIST.push(obj);
    }
    exportCSV(LIST);

  }
}