import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PublicService } from './services/public.service';

@Component({
    template: ''
})
export class RedirectComponent {
    constructor(private router: Router, private publicService: PublicService) { }

    ngOnInit(): void {
        let redirectPath = '/dashboard';

        const permissions = [
            { path: '/dashboard', permission: ['DASHBOARD'] },
            { path: '/users', permission: ['USERS'] },
        ];

        for (const { path, permission } of permissions) {
            if (this.publicService.hasPermission(permission)) {
                redirectPath = path;
                break;
            }
        }

        this.router.navigate([redirectPath]);
    }
}
