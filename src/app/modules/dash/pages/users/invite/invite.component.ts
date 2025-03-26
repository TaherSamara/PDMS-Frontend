import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/modules/dash/services/api.service';
import { HttpService } from 'src/app/modules/dash/services/http.service';
import { ToastrsService } from 'src/app/modules/dash/services/toaster.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent {

  public user: any;
  constructor(public activeModal: NgbActiveModal, public httpService: HttpService, private api: ApiService,
    private toastrsService: ToastrsService) { }

  invite() {
    this.httpService.action(this.api.users.invite(this.user.id), {}, 'inviteUserLoader').subscribe({
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
