import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { PublicService } from '../../../services/public.service';
import { HttpService } from '../../../services/http.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-passwords',
  templateUrl: './passwords.component.html',
  styleUrls: ['./passwords.component.css']
})
export class PasswordsComponent {

  user: any;
  form: FormGroup;
  submitted: boolean = false;
  message: string;
  messageType: string;
  file: File | null = null;
  imageUrl: string | ArrayBuffer = '';

  constructor(public httpService: HttpService, private api: ApiService, public publicService: PublicService,
    public authService: AuthService) {
  }

  ngOnInit() {
    this.user = this.publicService.getUserData();
    this.initForm();
  }

  get f() {
    return this.form.controls;
  }

  showMsg(success: boolean, msg: string) {
    this.message = msg;
    this.messageType = success ? 'success' : 'danger';
  }

  forget() {
    this.authService.forget(this.user.company_email).subscribe({
      next: (res) => {
        this.showMsg(res.success, res.message);
        setTimeout(() => {
          this.showMsg(false, '');
        }, 3000);
      }
    });
  }

  change() {
    this.submitted = true;
    if (this.form.valid) {
      this.authService.changePassword(this.user.id, this.f.CurrentPassword.value, this.f.NewPassword.value, this.f.ConfirmNewPassword.value)
        .subscribe({
          next: (res) => {
            this.submitted = false;
            this.showMsg(res.success, res.message);
            setTimeout(() => {
              this.showMsg(false, '');
            }, 3000);
          }
        });
    }
  }

  processSingle(event: any): void {
    const file: File = event.target.files[0];
    if (file.type.includes('image')) {
      this.file = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.showMsg(false, 'Please enter a valid image');
      setTimeout(() => {
        this.showMsg(false, '');
      }, 3000);
    }
  }

  initForm() {
    this.form = new FormGroup({
      CurrentPassword: new FormControl('', Validators.required),
      NewPassword: new FormControl('', Validators.required),
      ConfirmNewPassword: new FormControl('', Validators.required)
    });
  }
}
