import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class HttpService {

    private loadingMap = new Map<string, BehaviorSubject<boolean>>();
    constructor(private http: HttpClient) { }

    getLoading(loader?: string): Observable<boolean> {
        if (!loader) {
            return new BehaviorSubject<boolean>(false).asObservable();
        }
        if (!this.loadingMap.has(loader)) {
            this.loadingMap.set(loader, new BehaviorSubject<boolean>(false));
        }
        return this.loadingMap.get(loader)!.asObservable();
    }

    setLoading(loader?: string, isLoading: boolean = false): void {
        if (!loader) {
            return;
        }
        if (!this.loadingMap.has(loader)) {
            this.loadingMap.set(loader, new BehaviorSubject<boolean>(false));
        }
        this.loadingMap.get(loader)!.next(isLoading);
    }

    list(url: string, data: any, loader?: string): Observable<any> {
        if (loader) {
            this.setLoading(loader, true);
        }
        return this.http.get(url, data).pipe(
            tap({
                next: (res: any) => res,
                error: (err: any) => err,
                finalize: () => loader && this.setLoading(loader, false)
            })
        );
    }

    action(url: string, data: any, loader?: string): Observable<any> {
        if (loader) {
            this.setLoading(loader, true);
        }
        return this.http.post(url, data).pipe(
            tap({
                next: (res: any) => res,
                error: (err: any) => err,
                finalize: () => loader && this.setLoading(loader, false)
            })
        );
    }
}
