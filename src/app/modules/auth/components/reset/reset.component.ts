import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent {

  id: string;
  resetForm: FormGroup;
  submitted: boolean = false;
  message: string;
  messageType: string;

  constructor(public authService: AuthService, private fb: FormBuilder, private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.resetForm = this.fb.group({
      password: ["", Validators.required]
    });
  }

  get f() {
    return this.resetForm.controls;
  }

  showMsg(success: boolean, msg: string) {
    this.message = msg;
    this.messageType = success ? 'success' : 'danger';
    this.changeDetectorRef.detectChanges();
  }

  submit() {
    this.submitted = true;
    if (this.resetForm.valid) {
      this.showMsg(false, '');
      this.authService.reset(this.id, this.f.password.value).subscribe({
        next: (res: any) => this.showMsg(res.success, res.message)
      });
    }
  }
}
