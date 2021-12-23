import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { UploadUsersDialogComponent } from '../upload-users-dialog/upload-users-dialog.component';

@Component({
  selector: 'app-upload-users',
  templateUrl: './upload-users.component.html',
  styleUrls: ['./upload-users.component.css']
})
export class UploadUsersComponent implements OnInit {
  subject$ = new Subject<void>();
  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) { }


  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
  openDialog(LIST: any, mode: boolean, title: string, subtitle: string) {
    const dialogRef = this.dialog.open(UploadUsersDialogComponent, {
      width: '95%',
      disableClose: true,
      data: { data: LIST, mode, title: title, subtitle }
    });

    dialogRef.componentInstance.buttonEvent.pipe(takeUntil(this.subject$)).subscribe(result => {
      if (result) {
        if (true) {
          this.userService.insertMany(LIST)
            .pipe(takeUntil(this.subject$)).subscribe({
              next: (data) => this.onServerResponse(data, dialogRef),
              error: (error) => console.log(error),
              complete: () => [console.log('report')]
            })
        }
      }
    })
  }

  onServerResponse(data: any, dialogRef: any) {
    console.log(data.lengh, data);
    if (data.writeErrors) {
      let objLIST: any = [];
      console.log('code 1100true');
      data.writeErrors.forEach((e: any) => {
        let errmsg1:string = '';
        if(e.errmsg.includes("E11000")){
          errmsg1 = `${e.errmsg.substring(
            e.errmsg.indexOf("{") + 1, 
            e.errmsg.lastIndexOf("\"")
        ).replace('"', '').trim()} already exists`;
        }
        console.log(errmsg1);
        objLIST.push({
          first_name: e.op.first_name,
          last_name: e.op.last_name,
          middle_name: e.op.middle_name,
          username: e.op.username,
          email: e.op.email,
          password: e.op.password,
          roles: e.op.roles,
          errmsg: errmsg1
        })
      });
      console.log(objLIST);
      dialogRef.componentInstance.data = { data: objLIST, mode: false, title: `Added ${data.insertedDocs.length} Records`, subtitle: `Unable to add ${data.writeErrors.length} records` }
      dialogRef.componentInstance.isButtonDisable = false;
      dialogRef.componentInstance.showReportButton = true;
      dialogRef.componentInstance.updateData();
    } 
    else if (data.length>0){
      
      dialogRef.componentInstance.data = { data: [], mode: false, title: `Added ${data.length} Records`, subtitle: `` }
      dialogRef.componentInstance.isButtonDisable = false;
      dialogRef.componentInstance.updateData();
      dialogRef.updateSize("220px", "160px");
    }
  }


  onFileClick(event: any) {
    console.log(event.target.files);
  }
  userArray: any = [];
  getData(event: any) {
    let file = event.target.files[0];
    let reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      let raw: any = reader.result;
      //   console.log(CSVToJSON(raw));
      let jsonLIST = CSVToJSON(raw);
      let FIELDMISSLIST = this.checkmissingFields(jsonLIST, ['first_name', 'last_name', 'username', 'password'])

      if (FIELDMISSLIST.length > 0) {
        console.log('missing list', FIELDMISSLIST);
        this.openDialog(FIELDMISSLIST, false, 'Fields error', 'Fields are missing for following records or invalid role entered. Please ensure required fields are filled up with valid role.');

      } else if (FIELDMISSLIST.length == 0) {
        this.openDialog(jsonLIST, true, `${jsonLIST.length} records found`, '');
      }
    }
  }

  checkmissingFields(LIST: any, REQUIREDKEYS: any) {
    let FIELDMISSINGLIST: any = [];
    for (let i = 0; i < LIST.length; i++) {
      let isempty = false;
      for (let k = 0; k < REQUIREDKEYS.length; k++) {
        let key = REQUIREDKEYS[k];

        if (!LIST[i][key]) {
          isempty = true; //if fields missing add to LIST
        }
        
      }
      if ((LIST[i]['roles']=='Admin')||(LIST[i]['roles']=='User')||(LIST[i]['roles']=='Moderator')) {
        
      }else{
        isempty = true; //if roles incorrect add to LIST
      }
      if (isempty) {
        FIELDMISSINGLIST.push(LIST[i]);
      }
    }
    return FIELDMISSINGLIST;
  }

 

}

export function CSVToJSON(raw: any) {
  let LIST: any = [];
  const list = raw.split(/\r\n|\r|\n/g);
  
  list.forEach((e: any) => {
    let items = CSVtoArray1(e);
    LIST.push(items);
  });
  //var data = CSVToArray(csvData, null);
  var data = LIST.slice(0, -1);
  var objData: any = [];
  console.log(data);
  for (var i = 1; i < data.length; i++) {
    objData[i - 1] = {};
    for (var k = 0; k < data[0].length && k < data[i].length; k++) {
      var key = data[0][k];
      objData[i - 1][key] = data[i][k]
    }
  }
  var jsonData = JSON.stringify(objData);
  jsonData = jsonData.replace(/},/g, "},\r\n");
  jsonData = JSON.parse(jsonData);
  return jsonData;
}

export function CSVToArray(csvData: any, delimiter: any) {
  delimiter = (delimiter || ",");
  let pattern = new RegExp((
    "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    "([^\"\\" + delimiter + "\\r\\n]*))"), "gi");
  let dataInner: any = [];
  let data = [[]] as any;
  let matches = null;
  while (matches = pattern.exec(csvData)) {
    let matchedDelimiter: any = [];
    matchedDelimiter = matches[1];
    if (matchedDelimiter.length && (matchedDelimiter != delimiter)) {
      data.push([]);
    }
    if (matches[2]) {
      matchedDelimiter = matches[2].replace(
        new RegExp("\"\"", "g"), "\"");
    } else {
      matchedDelimiter = matches[3];
    }
    data[data.length - 1].push(matchedDelimiter);
  }
  return (data);
}

export function CSVtoArray1(text: any) {
  var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
  var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
  // Return NULL if input string is not well formed CSV string.
  if (!re_valid.test(text)) return null;
  var a = [];                     // Initialize array to receive values.
  text.replace(re_value, // "Walk" the string using replace with callback.
    function (m0: any, m1: any, m2: any, m3: any) {
      // Remove backslash from \' in single quoted values.
      if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
      // Remove backslash from \" in double quoted values.
      else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
      else if (m3 !== undefined) a.push(m3);
      return ''; // Return empty string.
    });
  // Handle special case of empty last value.
  if (/,\s*$/.test(text)) a.push('');
  return a;
};

export class User {
  id: number;
  name: String;
  lastName: String;
  constructor(id: number, name: String, lastName: String) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
  }
}