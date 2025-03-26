import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root',
})
export class ToastrsService {

    constructor(private toastrService: ToastrService) { }

    ShowError(message: string, title: string = '') {
        this.toastrService.error(message, title, {
            positionClass: "toast-top-left",
            timeOut: 3000,
            extendedTimeOut: 3000
        });
    }

    ShowSuccess(message: string, title: string = '') {
        this.toastrService.success(message, title, {
            positionClass: "toast-top-left",
            timeOut: 3000,
            extendedTimeOut: 3000
        });
    }

    ShowInfo(message: string, title: string = '') {
        this.toastrService.info(message, title, {
            positionClass: "toast-top-left",
            timeOut: 7000,
            extendedTimeOut: 3000
        });
    }

    ShowWarning(message: string, title: string = '') {
        this.toastrService.warning(message, title, {
            positionClass: "toast-top-left",
            timeOut: 5000,
            extendedTimeOut: 3000
        });
    }
}