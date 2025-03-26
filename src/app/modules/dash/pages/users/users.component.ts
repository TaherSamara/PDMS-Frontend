import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ApiService } from '../../services/api.service';
import { PublicService } from '../../services/public.service';
import { ToastrsService } from '../../services/toaster.service';
import { HttpParams } from '@angular/common/http';
import { DeleteComponent } from '../../shared/delete/delete.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InviteComponent } from './invite/invite.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  users: any = [];
  searchText: string = '';
  page: number = 1;
  size: number = 10;
  totalCount: number;
  totalRecords: number;

  constructor(public httpService: HttpService, private api: ApiService, public publicService: PublicService,
    private toastrsService: ToastrsService, private modalService: NgbModal) {
    this.size = this.publicService.getNumOfRows(306, 73.4);
  }

  ngOnInit(): void {
    this.list(1);
  }

  list(p: number): void {
    this.page = p;
    let params = new HttpParams()
      .set('q', this.searchText)
      .set('size', this.size)
      .set('page', this.page);

    this.httpService.list(this.api.users.list, { params }, 'usersLoader').subscribe({
      next: (res: any) => {
        if (res.success) {
          this.users = res.data.data;
          this.totalCount = res.data.total_count;
          this.totalRecords = res.data.total_records;
        } else {
          this.toastrsService.ShowError(res.message);
        }
      }
    });
  }

  activate(user: any) {
    this.httpService.action(this.api.users.active(user.id), {}).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastrsService.ShowSuccess(res.message);
        } else {
          this.toastrsService.ShowError(res.message);
        }
      }
    });
  }

  resetPassword(user: any) {
    const modalRef = this.modalService.open(ResetPasswordComponent, { centered: true });
    modalRef.componentInstance.user = user;
  }

  invite(user: any) {
    const modalRef = this.modalService.open(InviteComponent, {});
    modalRef.componentInstance.user = user;
  }

  delete(user: any) {
    const modalRef = this.modalService.open(DeleteComponent, {});
    modalRef.componentInstance.id = user.id;
    modalRef.componentInstance.type = 'user';
    modalRef.componentInstance.message = `Do you want to delete ${user.first_name} ${user.last_name} ?`;
    modalRef.result.then(() => this.list(1));
  }

  reset() {
    this.searchText = '';
    this.size = this.publicService.getNumOfRows(306, 73.4);
    this.list(1);
  }
}