import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { GlobalErrorHandler } from './global-error-handler.service';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class HttpIntereceptor implements HttpInterceptor {
    constructor(private globalErrorHandler: GlobalErrorHandler) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let errorMsg = '';
                    if (error.error instanceof ErrorEvent) {
                        console.log('This is client side error');
                        errorMsg = `Error: ${error.error.message}`;
                    } else {
                        console.log('This is server side error');
                        errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
                    }
                    console.log(errorMsg);
                    return throwError(errorMsg);
                })
            )
    }
}
//this.globalErrorHandler.handleError(errorResponse);
/**
* Provider POJO for the interceptor
*/
export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpIntereceptor,
    multi: true,
};


@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService
    ) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const sendTokentoURL = [`http://localhost:8000`,`https://event-node.herokuapp.com`,'http://event-node.herokuapp.com'];

        let isSendToken = false;
        let clonedRequest = req.clone();
        for (let i = 0; i < sendTokentoURL.length; i++) {
            if (req.url.includes(sendTokentoURL[i])) {
                //only send token to listed URLS
                isSendToken = true;
            }
        }
        if (!this.authService.isTokenExpired() && isSendToken) {

            console.log(isSendToken, 'isSendToken');
            console.log(!this.authService.isTokenExpired(), '!this.authService.isTokenExpired()');
            console.log(this.authService.getToken());

            // Clone the request to add the new header
            clonedRequest = req.clone({
                headers: new HttpHeaders({
                    Accept: `application/json`,
                    'Content-Type': `application/json`,
                    'Access-Control-Allow-Origin':'*',
                    Authorization: this.authService.getToken()
                })
            });
        }
        else {
            clonedRequest = req.clone({
                setHeaders: {
                    Accept: `application/json`,
                    'Content-Type': `application/json`,
                    'Access-Control-Allow-Origin':'*'
                }
            });
        }
        console.log('clonedRequest', clonedRequest);
        // Pass the cloned request instead of the original request to the next handle                     
        return next.handle(clonedRequest);
    }
}

export const HeaderInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: HeaderInterceptor,
    multi: true,
};


