import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent {

  form: FormGroup;
  submitted: boolean = false;
  message: string;
  messageType: string;

  constructor(private fb: FormBuilder, public authService: AuthService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]]
    });
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
      this.authService.forget(this.f.email.value).subscribe({
        next: (res: any) => {
          this.showMsg(res.success, res.message);
        }
      });
    }
  }
}
