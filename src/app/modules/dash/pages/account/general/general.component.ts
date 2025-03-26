import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { PublicService } from '../../../services/public.service';
import { HttpService } from '../../../services/http.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent {

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

  save() {
    this.submitted = true;
    if (this.form.valid) {
      var formData = new FormData();
      formData.append('first_name', this.f.FirstName.value ?? '');
      formData.append('middle_name', this.f.MiddleName.value ?? '');
      formData.append('last_name', this.f.LastName.value ?? '');
      formData.append('personal_email', this.f.PersonalEmail.value ?? '');
      formData.append('phone', this.f.Phone.value ?? '');
      formData.append('address', this.f.Address.value ?? '');

      if (this.file) {
        formData.append('File', this.file);
      }

      this.httpService.action(this.api.users.editProfile(this.user.id), formData, 'editProfileLoader').subscribe({
        next: (res: any) => {
          if (res.success) {
            this.submitted = false;
            this.showMsg(true, 'Your changes have been successfully saved.');
            setTimeout(() => {
              this.showMsg(false, '');
            }, 3000);

            let decryptedData = localStorage.getItem('paltel-data');
            let storedData = decryptedData ? this.publicService.decryptData(decryptedData) : null;

            storedData.user = res.data;
            let encryptedData = this.publicService.encryptData(storedData);
            localStorage.setItem('paltel-data', encryptedData);
            window.location.reload();
          } else {
            this.showMsg(false, res.message);
            setTimeout(() => {
              this.showMsg(false, '');
            }, 3000);
          }
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
      FirstName: new FormControl(this.user.first_name, Validators.required),
      MiddleName: new FormControl(this.user.middle_name),
      LastName: new FormControl(this.user.last_name, Validators.required),
      PersonalEmail: new FormControl(this.user.personal_email, Validators.required),
      Phone: new FormControl(this.user.phone, Validators.required),
      Address: new FormControl(this.user.address)
    });
  }
}
