import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {

  constructor(private authService: AuthService) { }

  canActivate() {
    const user = localStorage.getItem('paltel-data');
    if (user) {
      return true;
    }

    this.authService.logout();
    return true;
  }
}
