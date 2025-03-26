import { Injectable, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class PublicService {

    public numOfRows: number;
    public innerHeight: number;
    private storageKey = 'paltel-data';
    private encryptionKey = 'paltel-key';
    public onlineStatus: Subject<boolean> = new Subject<boolean>();

    @HostListener('window:resize', ['$event'])
    onResize() { }

    constructor() {
        this.innerHeight = window.innerHeight;
        this.onlineStatus.next(navigator.onLine);
        window?.addEventListener('online', () => {
            this.onlineStatus.next(true);
        });

        window?.addEventListener('offline', () => {
            this.onlineStatus.next(false);
        });
    }

    public getUserData() {
        const encryptedData = localStorage.getItem(this.storageKey);
        const data = encryptedData ? this.decryptData(encryptedData) : null;
        return data ? data.user : null;
    }

    public getUserBranches() {
        const encryptedData = localStorage.getItem(this.storageKey);
        const data = encryptedData ? this.decryptData(encryptedData) : null;
        return data ? data.branches : null;
    }

    public getPermissions() {
        const encryptedData = localStorage.getItem(this.storageKey);
        const data = encryptedData ? this.decryptData(encryptedData) : null;
        return data ? data.permissions : null;
    }

    public hasPermission(permissions: string[]): boolean {
        const encryptedData = localStorage.getItem(this.storageKey);
        const data = encryptedData ? this.decryptData(encryptedData) : null;
        const storedPermissions = data?.permissions;

        return permissions?.some(permission => storedPermissions?.includes(permission));
    }

    public hasAllPermissions(permissions: string[]): boolean {
        const encryptedData = localStorage.getItem(this.storageKey);
        const data = encryptedData ? this.decryptData(encryptedData) : null;
        const storedPermissions = data?.permissions;

        return permissions?.every(permission => storedPermissions?.includes(permission));
    }

    public getNumOfRows(innerHeight: number, rowHeight: number): number {
        this.numOfRows = Math.max(1, Math.floor((window.innerHeight - innerHeight) / rowHeight));
        return this.numOfRows;
    }

    public encryptData(data: any): string {
        return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
    }

    public decryptData(data: string): any {
        try {
            const bytes = CryptoJS.AES.decrypt(data, this.encryptionKey);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (error) {
            return null;
        }
    }
}
