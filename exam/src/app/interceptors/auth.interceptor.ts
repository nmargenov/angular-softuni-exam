import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService:CookieService,private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.cookieService.get(environment.TOKEN);

    if (req.url.includes('api') && token) {
      req = req.clone({
        headers: req.headers.set('x-authorization', 'Bearer ' + token)
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.cookieService.delete(environment.TOKEN);
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}
