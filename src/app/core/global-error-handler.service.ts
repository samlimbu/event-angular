import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) { }
  handleError(error:any) {
     console.log('from GlobalErrorHandler', error);
     
    const router = this.injector.get(Router);
    console.log('Req url: ${router.url}');
    console.log('rtouer', router);
 
     //router.navigate(['/home/error']);
     throw error;
  }
}
