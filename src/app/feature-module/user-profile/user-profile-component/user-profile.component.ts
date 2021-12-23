import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmationBoxComponent } from 'src/app/shared-ui/confirmation-box/confirmation-box.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  form!: FormGroup;
  subject$ = new Subject<void>();
  myForm!: FormGroup;
  errorMessage: any;
  errorMessageProfile: any;
  isButtonDisable: boolean = false;
  isButtonDisableProfile: boolean = false;
  isEditProfile: boolean = false;

  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private _fb1: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.createForm();
    this.createRegForm();
    this.refreshUpdateProfile();
  }
  refreshUpdateProfile() {
    this.userService.getUserProfile(this.authService.getUserProfile())
      .subscribe(
        data => [this.setRegFormValues(data), this.isEditProfile = false]
      )
  }
  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
  createRegForm() {
    this.form = this._fb1.group({
      first_name: ['', [Validators.required]],
      middle_name: [''],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.email]],
      username: ['', [Validators.required]]
    });
    this.form.controls['username'].disable();
  }

  setRegFormValues(user: any) {
    this.form.setValue({
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      email: user.email,
      username: user.username
    });
    this.form.disable();
  }
  createForm() {
    this.myForm = this._fb.group({
      current_password: ['', [Validators.required]],
      new_password: ['', [Validators.required]],
      new_password_check: ['', [Validators.required]]
    },
      {
        validator: ConfirmedValidator('new_password', 'new_password_check')
      }

    );

    console.log(this.f['new_password_check'].errors)
  }

  get f() {

    return this.myForm.controls;
  }
  onEditProfile() {
    this.form.enable();
    this.isEditProfile = true;
  }
  onSubmitProfile() {
    console.log(this.form.value);
    this.openDialogReset({});
  }

  openDialogReset(e: any) {
    console.log(e);
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '265px',
      disableClose: false,
      data: { text: '', disabled: false, title: "Enter Current Password" }
    });

    dialogRef.componentInstance.buttonEvent.pipe(takeUntil(this.subject$)).subscribe(data => {
      console.log('event dialogue', data);
      if (data) {
        console.log('event dialogue', data.text);

        let userObj = this.form.value;
        userObj['auth'] = btoa(`${this.authService.getUserProfile()['username']}:${data.text}`);



        this.userService.updateUser(userObj)
          .subscribe(
            data => {
              if (data.sucess) {
                dialogRef.componentInstance.onNoClick();
                this.errorMessageProfile = data.msg;
                this.refreshUpdateProfile();
              } else if (!data.sucess) {
                dialogRef.componentInstance.onNoClick();
                this.errorMessageProfile = data.msg;
              }
            }
          )
      }
    })

  }
  getUserProfile(obj: any) {
    this.userService.getUserProfile(obj)
      .subscribe(
        data => console.log(data)
      )
  }
  onSubmit() {
    let userObj = this.authService.getUserProfile()

    userObj['auth'] = btoa(`${this.authService.getUserProfile()['username']}:${this.myForm.value.current_password}:${this.myForm.value.new_password}`);

    this.errorMessage = '';
    this.isButtonDisable = true;
    console.log(this.authService.getUserProfile());

    this.userService.changePassword(userObj)
      .pipe(takeUntil(this.subject$))
      .subscribe(
        {
          next: (data) => { this.handleData(data) },
          error: (error) => { },
          complete: () => { },
        }
      )
  }
  handleData(data: any) {
    this.errorMessage = data.msg;
    if (data.success) {
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000)
    } else {
      this.isButtonDisable = false;
    }
  }


}


export function ConfirmedValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}