import { Component } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { ApiService } from '../../../../services/api.service';
import { ToastrsService } from '../../../../services/toaster.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditRoleComponent {

  public role: any = {};
  permissions: any = [];
  selectedIds: number[] = [];
  roleName: string;

  constructor(public activeModal: NgbActiveModal, public httpService: HttpService, private api: ApiService,
    private toastrsService: ToastrsService) { }

  ngOnInit(): void {
    this.roleName = this.role.name;
    this.getPermissions();
  }

  getPermissions() {
    this.httpService.list(this.api.common.permissions, {}, 'permissionsLoader').subscribe({
      next: (res: any) => {
        if (res.success) {
          this.permissions = res.data;
          this.getRolePermissions();
        }
      }
    });
  }

  getRolePermissions() {
    this.httpService.list(this.api.roles.details(this.role.id), {}, 'rolePermissionsLoader').subscribe({
      next: (res: any) => {
        if (res.success) {
          res.data.permissions.forEach((permission: any) => {
            this.selectPermissionRecursively(permission, true);
          });
        }
      }
    });
  }

  save(): void {
    if (this.roleName) {
      this.httpService.action(this.api.roles.edit(this.role.id),
        { name: this.roleName, permissionsIds: this.selectedIds }, 'editRoleLoader')
        .subscribe({
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

  isSelected(id: number): boolean {
    return this.selectedIds.includes(id);
  }

  onSelect(id: number, event: any) {
    const isChecked = event.target.checked;
    if (isChecked) {
      if (!this.isSelected(id)) {
        this.selectedIds.push(id);
      }
    } else {
      const index = this.selectedIds.indexOf(id);
      if (index !== -1) {
        this.selectedIds.splice(index, 1);
      }
    }
  }

  hasPermission(permissions: any[], code: string): boolean {
    return permissions.some(permission => permission.code === code);
  }

  getPermissionId(permissions: any[], code: string): number {
    const permission = permissions.find(permission => permission.code === code);
    return permission ? permission.id : -1;
  }

  toggleGroupPermissions(permissionGroup: any, event: any) {
    const isChecked = event.target.checked;
    permissionGroup.permissions.forEach((permission: any) => {
      const id = permission.id;
      if (isChecked && !this.isSelected(id)) {
        this.selectedIds.push(id);
      } else if (!isChecked && this.isSelected(id)) {
        const index = this.selectedIds.indexOf(id);
        if (index !== -1) {
          this.selectedIds.splice(index, 1);
        }
      }
    });
  }

  areAllGroupPermissionsSelected(permissions: any[]): boolean {
    return permissions.every(permission => this.isSelected(permission.id));
  }

  togglePermission(permission: any, event: any) {
    const isChecked = event.target.checked;

    if (permission.sub_permissions) {
      this.updateChildrenPermissions(permission, isChecked);
    } else {
      this.updatePermissionSelection(permission, isChecked);
    }

    this.updateParentPermissionState(permission);
  }

  updateChildrenPermissions(parentPermission: any, isChecked: boolean) {
    parentPermission.sub_permissions.forEach((subPermission: any) => {
      this.updatePermissionSelection(subPermission, isChecked);
    });
    this.updatePermissionSelection(parentPermission, isChecked);
  }

  updatePermissionSelection(permission: any, isChecked: boolean) {
    const index = this.selectedIds.indexOf(permission.id);
    if (isChecked && index === -1) {
      this.selectedIds.push(permission.id);
    } else if (!isChecked && index !== -1) {
      this.selectedIds.splice(index, 1);
    }
  }

  updateParentPermissionState(permission: any) {
    const parentPermission = this.permissions.find((p: any) =>
      p.sub_permissions && p.sub_permissions.some((sp: any) => sp.id === permission.id)
    );
    if (parentPermission) {
      const anySubPermissionSelected = parentPermission.sub_permissions.some((sp: any) =>
        this.selectedIds.includes(sp.id)
      );
      const parentIndex = this.selectedIds.indexOf(parentPermission.id);

      if (anySubPermissionSelected && parentIndex === -1) {
        this.selectedIds.push(parentPermission.id);
      } else if (!anySubPermissionSelected && parentIndex !== -1) {
        this.selectedIds.splice(parentIndex, 1);
      }
    }
  }

  selectPermissionRecursively(permission: any, isChecked: boolean) {
    this.updatePermissionSelection(permission, isChecked);
    if (permission.sub_permissions) {
      permission.sub_permissions.forEach((subPermission: any) => {
        this.selectPermissionRecursively(subPermission, isChecked);
      });
    }
  }
}
