import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PublicService } from '../../dash/services/public.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard {

  constructor(private router: Router, private publicService: PublicService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const encryptedUserData = localStorage.getItem('paltel-data');
    const requiredPermissions = route.data['permissions'];

    if (encryptedUserData) {
      const userData = this.publicService.decryptData(encryptedUserData);
      if (userData) {
        const userPermissions = userData.permissions;
        const hasPermission = requiredPermissions.some((permission: any) => userPermissions.includes(permission));

        if (hasPermission) {
          return true;
        }
      }
    }

    this.router.navigate(['/error/403']);
    return false;
  }
}
