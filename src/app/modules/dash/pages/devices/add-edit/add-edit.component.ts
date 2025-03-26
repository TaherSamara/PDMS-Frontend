import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/modules/dash/services/api.service';
import { HttpService } from 'src/app/modules/dash/services/http.service';
import { ToastrsService } from 'src/app/modules/dash/services/toaster.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent {

  public device: any;
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

  submit(): void {
    this.submitted = true;
    if (this.form.valid) {
      let url = this.device ? this.api.devices.edit(this.device.id) : this.api.devices.add;
      let paylod = {
        name: this.f.Name.value,
        ip_address: this.f.IpAddress.value,
        line_code: this.f.LineCode.value,
        device_type: this.f.DeviceType.value,
        latitude: this.f.Latitude.value,
        longitude: this.f.Longitude.value
      }
      this.httpService.action(url, paylod, 'actionsDevicesLoader').subscribe({
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
      Name: new FormControl(this.device ? this.device.name : '', Validators.required),
      IpAddress: new FormControl(this.device ? this.device.ip_address : '', Validators.required),
      LineCode: new FormControl(this.device ? this.device.line_code : '', Validators.required),
      DeviceType: new FormControl(this.device ? this.device.device_type : '', Validators.required),
      Latitude: new FormControl(this.device ? this.device.latitude : '', Validators.required),
      Longitude: new FormControl(this.device ? this.device.longitude : '', Validators.required),
    });
  }
}