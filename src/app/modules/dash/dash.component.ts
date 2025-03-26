import { Component } from '@angular/core';
import { HttpService } from './services/http.service';
import { ApiService } from './services/api.service';
import { PublicService } from './services/public.service';
import { ToastrsService } from './services/toaster.service';
import { AuthService } from '../auth/services/auth.service';
import { defaultMapSettings, MapSettings } from './models/map-settings';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css'],
})
export class DashComponent {

  currentYear: number;
  constructor(private publicService: PublicService, private toastrsService: ToastrsService, public httpService: HttpService,
    private api: ApiService, private authService: AuthService) { }

  ngOnInit(): void {
    // this.refreshUser();
    this.currentYear = new Date().getFullYear();

    const settings = localStorage.getItem('paltel-settings');
    if (!settings) {
      const encryptedData = this.publicService.encryptData(defaultMapSettings);
      localStorage.setItem('paltel-settings', encryptedData);
    }

    setInterval(() => {
      this.refreshUser();
    }, 1000 * 60 * 5); // 5 minutes
  }

  refreshUser(): void {
    this.httpService.list(this.api.users.refresh, {}).subscribe({
      next: (res: any) => {
        if (res.success) {
          const encryptedData = this.publicService.encryptData(res.data);
          localStorage.setItem('paltel-data', encryptedData);
        } else {
          this.authService.logout();
          this.toastrsService.ShowInfo(res.message);
        }
      },
    });
  }
}
