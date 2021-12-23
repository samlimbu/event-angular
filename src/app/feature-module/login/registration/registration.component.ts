import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  subject$ = new Subject<void>();
  myForm!: FormGroup;
  errorMessage:any;
  isButtonDisable:boolean=false;
  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.createLoginForm();
  }
  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
  createLoginForm() {
    this.myForm = this._fb.group({
      first_name: ['', [Validators.required]],
      middle_name: ['', []],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  onSubmit() {
    console.log(this.myForm.value);
    this.errorMessage = '';
    this.isButtonDisable = true;
    this.userService.registerUser(this.myForm.value)
      .pipe(takeUntil(this.subject$)).subscribe(
        {
          next: (data) => {this.handleData(data)},
          error: (error) => {},
          complete: () => {},
        }
      )
  }
  handleData(data:any){
    this.errorMessage = data.msg;
    if(data.success){
      setTimeout(()=>{
        this.router.navigate(['/login']);
      },1000)
    }else{
      this.isButtonDisable = false;
    }
  }
}
