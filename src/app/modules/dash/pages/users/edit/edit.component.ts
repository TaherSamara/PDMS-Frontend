import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { ApiService } from 'src/app/modules/dash/services/api.service';
import { HttpService } from 'src/app/modules/dash/services/http.service';
import { PublicService } from 'src/app/modules/dash/services/public.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {

  user: any = {};
  lookups: any = {};
  form: FormGroup;
  submitted: boolean = false;
  currentStep: number = 1;
  totalSteps: number = 3;
  photo: File;
  imageUrl: string | ArrayBuffer = "";
  message: string;
  messageType: string;
  options: AnimationOptions = {
    path: '/assets/json/animation-completed.json',
    loop: false
  };
  styles: Partial<CSSStyleDeclaration> = {
    margin: '0 auto',
  };

  constructor(public publicService: PublicService, public httpService: HttpService, private api: ApiService,
    private changeDetectorRef: ChangeDetectorRef, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.initForm();
    this.getLookups();
    this.activatedRoute.params.subscribe(params => {
      this.getUser(Number(params['id']));
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

  getLookups() {
    this.httpService.list(this.api.common.lookups, {}, 'getLookupsLoader').subscribe({
      next: (res: any) => {
        if (res.success) {
          this.lookups = res.data;
        }
      }
    });
  }

  getUser(userId: number) {
    this.httpService.list(this.api.users.details(userId), {}, 'getUserLoader').subscribe({
      next: (res: any) => {
        this.user = res.data;
        this.form.patchValue({
          FirstName: res.data.first_name,
          MiddleName: res.data.middle_name,
          LastName: res.data.last_name,
          PersonalEmail: res.data.personal_email,
          CompanyEmail: res.data.company_email,
          Phone: res.data.phone,
          MaritalStatus: res.data.marital_status,
          Address: res.data.address,
          Role: res.data.role_id,
          ReceivesEmails: res.data.receives_emails ? '1' : '0',
          EmailFrequencyInHours: res.data.email_frequency_hours
        });
      }
    });
  }

  save() {
    this.submitted = true;
    var formData = new FormData();
    formData.append('first_name', this.f.FirstName.value);
    formData.append('middle_name', this.f.MiddleName.value ?? "");
    formData.append('last_name', this.f.LastName.value);
    formData.append('personal_email', this.f.PersonalEmail.value);
    formData.append('company_email', this.f.CompanyEmail.value);
    formData.append('phone', this.f.Phone.value ?? "");
    formData.append('marital_status', this.f.MaritalStatus.value ?? "");
    formData.append('address', this.f.Address.value ?? "");
    formData.append('role_id', this.f.Role.value);
    formData.append('receives_emails', this.f.ReceivesEmails.value);
    formData.append('email_frequency_hours', this.f.EmailFrequencyInHours.value);

    if (this.photo) {
      formData.append('file', this.photo);
    }

    this.httpService.action(this.api.users.edit(this.user.id), formData, 'editUserLoader').subscribe({
      next: (res: any) => {
        if (res.success) {
          this.showMsg(true, res.message);
          setTimeout(() => {
            this.router.navigate(['/users']);
          }, 2500);
        } else {
          this.showMsg(false, res.message);
        }
      }
    });
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  nextStep() {
    this.submitted = true;
    if (this.form.valid) {
      this.submitted = false;
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDropSingle(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer!.files;
    if (files.length > 0) {
      this.processSingleFile(files[0]);
    }
  }

  processSingle(event: any): void {
    const file: File = event.target.files[0];
    this.processSingleFile(file);
  }

  processSingleFile(file: File): void {
    if (file.type.includes("image")) {
      this.photo = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      this.showMsg(false, "");
    } else {
      this.showMsg(false, 'Please enter a valid image');
    }
  }

  initForm() {
    this.form = new FormGroup({
      FirstName: new FormControl('', Validators.required),
      MiddleName: new FormControl(''),
      LastName: new FormControl('', Validators.required),
      PersonalEmail: new FormControl('', [Validators.required, Validators.email]),
      CompanyEmail: new FormControl('', [Validators.required, Validators.email]),
      Phone: new FormControl(''),
      MaritalStatus: new FormControl(''),
      Address: new FormControl(''),
      Role: new FormControl('', Validators.required),
      ReceivesEmails: new FormControl('', Validators.required),
      EmailFrequencyInHours: new FormControl('', Validators.required)
    });
  }
}
