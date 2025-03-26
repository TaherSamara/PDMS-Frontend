import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { tap } from 'rxjs';
import { PublicService } from '../modules/dash/services/public.service';
import { AuthService } from '../modules/auth/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private publicService: PublicService, private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const encryptedData = localStorage.getItem('paltel-data');
    if (encryptedData) {
      const data = this.publicService.decryptData(encryptedData);
      if (data && data.token) {
        req = req.clone({
          headers: req.headers
            .set('Authorization', `Bearer ${data.token}`)
        });
      }
    } else {
      this.authService.logout();
    }

    return next.handle(req).pipe(tap({
      next: () => { },
      error: (err: any) => {
        if (err.status === 401) {
          this.authService.logout();
        }
      }
    }));
  }
}
