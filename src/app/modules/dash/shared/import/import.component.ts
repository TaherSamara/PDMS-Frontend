import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/modules/dash/services/api.service';
import { HttpService } from 'src/app/modules/dash/services/http.service';
import { ToastrsService } from 'src/app/modules/dash/services/toaster.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent {

  file: File;
  selectedFileName: string = 'No File Chosen';
  message: string;
  messageType: string;

  constructor(public activeModal: NgbActiveModal, public httpService: HttpService, private api: ApiService,
    private toastrsService: ToastrsService, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  showMsg(success: boolean, msg: string) {
    this.message = msg;
    this.messageType = success ? 'success' : 'danger';
    this.changeDetectorRef.detectChanges();
  }

  submit() {
    this.showMsg(false, '');
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);

      this.httpService.action(this.api.devices.import, formData, 'actionImportLoader').subscribe({
        next: (res: any) => {
          if (res.success) {
            this.showMsg(true, res.message);
            setTimeout(() => {
              this.activeModal.close();
            }, 1000);
          } else {
            this.showMsg(false, res.message);
          }
        }
      });
    } else {
      this.showMsg(false, 'Please choose Excel file!');
    }
  }

  onChange(event: any) {
    const file: File = event.target.files[0];
    const allowedMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    if (file.type === allowedMimeType && file.name.endsWith('.xlsx')) {
      this.file = file;
      this.selectedFileName = file.name;
      this.showMsg(false, '');
    } else {
      this.selectedFileName = 'No File chosen';
      this.showMsg(false, 'Only .xlsx Excel files are allowed!');
    }
  }
}
