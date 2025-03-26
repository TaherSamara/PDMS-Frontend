import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ToastrsService } from '../../../services/toaster.service';
import { PublicService } from '../../../services/public.service';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent {

  form: FormGroup;
  submitted: boolean = false;
  settings: any = {};

  constructor(public httpService: HttpService, private api: ApiService, private toastrsService: ToastrsService,
    public publicService: PublicService) { }

  ngOnInit() {
    this.initForm();
    this.list();
  }

  get f() {
    return this.form.controls;
  }

  list() {
    this.httpService.list(this.api.settings.list, {}).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.form.setValue({
            CompanyName: res.data[0].value,
            CompanyEmail: res.data[1].value,
            CompanyPhone: res.data[2].value,
            CompanyAddress: res.data[3].value
          });
        } else {
          this.toastrsService.ShowError(res.message);
        }
      }
    });
  }

  save() {
    this.submitted = true;
    if (this.form.valid) {
      this.httpService.action(this.api.settings.edit, {
        company_name: this.f.CompanyName.value, company_email: this.f.CompanyEmail.value, company_phone: this.f.CompanyPhone.value,
        company_address: this.f.CompanyAddress.value
      }, 'editSettingsLoader').subscribe({
        next: (res: any) => {
          if (res.success) {
            this.submitted = false;
            this.toastrsService.ShowSuccess(res.message);
          } else {
            this.toastrsService.ShowError(res.message);
          }
        }
      });
    }
  }

  initForm() {
    this.form = new FormGroup({
      CompanyName: new FormControl('', Validators.required),
      CompanyEmail: new FormControl('', Validators.required),
      CompanyPhone: new FormControl('', Validators.required),
      CompanyAddress: new FormControl('', Validators.required)
    });
  }
}
