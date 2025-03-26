import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/modules/dash/services/api.service';
import { HttpService } from 'src/app/modules/dash/services/http.service';
import { ToastrsService } from 'src/app/modules/dash/services/toaster.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  public user: any;
  form: FormGroup;
  submitted: boolean = false;

  constructor(public activeModal: NgbActiveModal, public httpService: HttpService, private api: ApiService,
    private toastrsService: ToastrsService) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    this.submitted = true;
    if (this.form.valid) {
      this.httpService.action(this.api.users.resetPassword(this.user.id),
        { new_password: this.f.NewPassword.value, confirm_password: this.f.ConfirmPassword.value }, 'resetPasswordLoader')
        .subscribe({
          next: (res: any) => {
            if (res.success) {
              this.activeModal.close();
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
      NewPassword: new FormControl('', Validators.required),
      ConfirmPassword: new FormControl('', Validators.required)
    });
  }
}
