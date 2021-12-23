import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService:AuthService,
    private router:Router) { }

    canActivate(){
        if(!this.authService.isTokenExpired()){
            return true;
        }
        else{
            this.router.navigate(['/login']);
            return false;
        }
    }
}
