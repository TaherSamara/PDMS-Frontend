import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PublicService } from 'src/app/modules/dash/services/public.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  form: FormGroup;
  submitted: boolean = false;
  message: string;
  messageType: string;

  constructor(private publicService: PublicService, private fb: FormBuilder, private router: Router, public authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    const authDataString = localStorage.getItem('paltel-auth');
    if (authDataString) {
      const decryptedData = this.publicService.decryptData(authDataString);
      if (decryptedData) {
        this.form.patchValue({
          email: decryptedData.email,
          password: decryptedData.password,
          rememberMe: true
        });
      }
    }
  }

  get f() {
    return this.form.controls;
  }

  showMsg(success: boolean, msg: string) {
    this.message = msg;
    this.messageType = success ? 'success' : 'danger';
    this.changeDetectorRef.detectChanges();
  }

  submit() {
    this.submitted = true;
    if (this.form.valid) {
      this.showMsg(false, '');
      const { email, password, rememberMe } = this.form.value;

      this.authService.login(email, password).subscribe({
        next: (res: any) => {
          if (res.success) {
            if (rememberMe) {
              const authData: any = { email, password };
              const encryptedData = this.publicService.encryptData(authData);
              localStorage.setItem('paltel-auth', encryptedData);
            } else {
              localStorage.removeItem('paltel-auth');
            }
            this.router.navigate(['/']);
          } else {
            this.showMsg(false, res.message);
            this.changeDetectorRef.detectChanges();
          }
        }
      });
    }
  }
}
