import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-box',
  templateUrl: './confirmation-box.component.html',
  styleUrls: ['./confirmation-box.component.css']
})
export class ConfirmationBoxComponent implements OnInit {
  buttonEvent: EventEmitter<any> = new EventEmitter();
  isButtonDisable = false;
  isDropDown = false;
  title: any;
  form!: FormGroup;
  selected='';
  dropdownLIST: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<ConfirmationBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder
  ) { }
  ngOnInit() {
    this.createForm();
    this.title = this.data.title;
    if (this.data.isDropDown)
      this.isDropDown = this.data.isDropDown;
    if (this.data.dropdownLIST)
      this.dropdownLIST = this.data.dropdownLIST;
      if(this.data.dropdownSelected)
      this.selected=this.data.dropdownSelected;
  }

  createForm() {
    this.form = this._fb.group({
      text: [{ value: this.data.text, disabled: this.data.disabled }]
    });
  }
  onClick(): void {
    this.dialogRef.disableClose = true;
    this.isButtonDisable = true;
    if(this.form.value.text){
      this.buttonEvent.emit(this.form.value);
    }
    else{
      this.buttonEvent.emit({text: this.selected});
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}





