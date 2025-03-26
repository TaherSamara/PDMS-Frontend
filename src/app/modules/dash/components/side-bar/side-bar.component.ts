import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../../auth/services/auth.service';
import { PublicService } from '../../services/public.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SidebarComponent {

  user: any = {};
  lang: any = '';
  currentRoute: string = '';
  notificationsCount: number = 0;

  constructor(public publicService: PublicService, private authService: AuthService, public httpService: HttpService,
    public router: Router) {
  }

  ngOnInit(): void {
    this.user = this.publicService.getUserData();
  }

  logout() {
    this.authService.logout();
  }
}
