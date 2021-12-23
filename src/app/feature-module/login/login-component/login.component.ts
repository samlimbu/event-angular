import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  subject$ = new Subject<void>();
  errorMessage: any;
  loginForm!: FormGroup;
  constructor(private authService: AuthService,
    private router: Router,
    private loginFormBuilder: FormBuilder
  ) { }

  ngOnInit() {
    if(!this.authService.isTokenExpired()){
      this.router.navigate(['/home']);
    }
    

    this.createLoginForm();
  }
  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
  createLoginForm() {
    this.loginForm = this.loginFormBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  onSubmit() {
    const user = {
      username: this.formUsername,
      password: this.formPassword
    }

    this.authService.authenticateUser(user)
    .pipe(takeUntil(this.subject$))
     .subscribe({
       next: (data:any) => {
        if (data['success']) {
          console.log(data);
          this.authService.storeUserData(data['token'], data['user']);
          this.router.navigate(['home']);

        }
        else {
          this.errorMessage = data['msg'];
        }

     }});
  }
  

  get formUsername() {
    return this.loginForm.get('username')!.value;
  }


  get formPassword() {
    return this.loginForm.get('password')!.value;
  }





}
