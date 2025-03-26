import { Component } from '@angular/core';
import { PublicService } from '../../../services/public.service';
import { HttpService } from '../../../services/http.service';
import { ApiService } from '../../../services/api.service';
import { ToastrsService } from '../../../services/toaster.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpParams } from '@angular/common/http';
import { DeleteComponent } from '../../../shared/delete/delete.component';
import { AddRoleComponent } from './add/add.component';
import { EditRoleComponent } from './edit/edit.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {

  roles: any = [];
  searchText: string = '';
  page: number = 1;
  size: number = 5;
  totalCount: any;
  totalRecords: any;

  constructor(public publicService: PublicService, public httpService: HttpService, private api: ApiService,
    private toastrsService: ToastrsService, private modalService: NgbModal) {
    this.size = this.publicService.getNumOfRows(306, 62.8);
  }

  ngOnInit(): void {
    this.list(this.page);
  }

  list(p: number) {
    this.page = p;
    let params = new HttpParams()
      .set('q', this.searchText)
      .set('size', this.size)
      .set('page', this.page);

    this.httpService.list(this.api.roles.list, { params }, 'rolesLoader').subscribe({
      next: (res: any) => {
        if (res.success) {
          this.roles = res.data.data;
          this.totalCount = res.data.total_count;
          this.totalRecords = res.data.total_records;
        } else {
          this.toastrsService.ShowError(res.message);
        }
      }
    });
  }

  add() {
    const modalRef = this.modalService.open(AddRoleComponent, { fullscreen: true, scrollable: true });
    modalRef.result.then(() => this.list(1));
  }

  edit(role: any) {
    const modalRef = this.modalService.open(EditRoleComponent, { fullscreen: true, scrollable: true });
    modalRef.componentInstance.role = role;
    modalRef.result.then(() => this.list(1));
  }

  delete(role: any) {
    const modalRef = this.modalService.open(DeleteComponent, {});
    modalRef.componentInstance.id = role.id;
    modalRef.componentInstance.type = 'role';
    modalRef.componentInstance.message = `Do you want to delete ${role.name} role ?`;
    modalRef.result.then(() => this.list(1));
  }
}
