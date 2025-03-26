import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ApiService } from '../../services/api.service';
import { PublicService } from '../../services/public.service';
import { ToastrsService } from '../../services/toaster.service';
import { HttpParams } from '@angular/common/http';
import { DeleteComponent } from '../../shared/delete/delete.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ImportComponent } from '../../shared/import/import.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent {

  devices: any = [];
  searchText: string = '';
  page: number = 1;
  size: number = 10;
  status: number = 0;
  totalCount: number;
  totalRecords: number;
  interval: any;

  constructor(public httpService: HttpService, private api: ApiService, public publicService: PublicService,
    private toastrsService: ToastrsService, private modalService: NgbModal, private route: ActivatedRoute) {
    this.size = this.publicService.getNumOfRows(306, 62.8);
  }

  ngOnInit(): void {
    this.status = Number(this.route.snapshot.paramMap.get('status')) || 0;

    this.list(1);
    this.interval = setInterval(() => {
      this.list(this.page, false);
    }, 1000 * 60);
  }

  list(p: number, withLoad: boolean = true): void {
    this.page = p;
    let params = new HttpParams()
      .set('q', this.searchText)
      .set('size', this.size)
      .set('page', this.page);

    if (this.status > 0) {
      params = params.set('status', this.status);
    }

    this.httpService.list(this.api.devices.list, { params }, withLoad ? 'devicesLoader' : '').subscribe({
      next: (res: any) => {
        if (res.success) {
          this.devices = res.data.data;
          this.totalCount = res.data.total_count;
          this.totalRecords = res.data.total_records;
        } else {
          this.toastrsService.ShowError(res.message);
        }
      }
    });
  }

  import() {
    const modalRef = this.modalService.open(ImportComponent, {});
    modalRef.result.then(() => this.list(1, false));
  }

  add() {
    const modalRef = this.modalService.open(AddEditComponent, { size: 'lg', centered: true });
    modalRef.result.then(() => this.list(1, false));
  }

  edit(device: any) {
    const modalRef = this.modalService.open(AddEditComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.device = device;
    modalRef.result.then(() => this.list(1, false));
  }

  delete(device: any) {
    const modalRef = this.modalService.open(DeleteComponent, {});
    modalRef.componentInstance.id = device.id;
    modalRef.componentInstance.type = 'device';
    modalRef.componentInstance.message = `Do you want to delete ${device.name} ?`;
    modalRef.result.then(() => this.list(1));
  }

  reset() {
    this.searchText = '';
    this.status = 0;
    this.size = this.publicService.getNumOfRows(306, 62.8);
    this.list(1);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}