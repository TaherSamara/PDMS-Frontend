import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PublicService } from '../../dash/services/public.service';

const API_BASE_URL = `${environment.baseUrl}/api/auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  isAuthLoading$: Observable<boolean>;
  isAuthLoadingSubject: BehaviorSubject<boolean>;

  isChangeLoading$: Observable<boolean>;
  isChangeLoadingSubject: BehaviorSubject<boolean>;

  constructor(private publicService: PublicService, private http: HttpClient, private router: Router) {
    this.isAuthLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isAuthLoading$ = this.isAuthLoadingSubject.asObservable();

    this.isChangeLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isChangeLoading$ = this.isChangeLoadingSubject.asObservable();
  }

  login(email: string, password: string): Observable<any> {
    this.isAuthLoadingSubject.next(true);
    return this.http.post<any>(`${API_BASE_URL}/login`, { email, password }).pipe(
      tap({
        next: (res: any) => {
          if (res.success) {
            const encryptedData = this.publicService.encryptData(res.data);
            localStorage.setItem('paltel-data', encryptedData);
          }
          return res;
        },
        error: (err: any) => err,
        finalize: () => this.isAuthLoadingSubject.next(false)
      })
    );
  }

  forget(email: string): Observable<any> {
    this.isAuthLoadingSubject.next(true);
    return this.http.post<any>(`${API_BASE_URL}/forget-password`, { email }).pipe(
      tap({
        next: (res: any) => res,
        error: (err: any) => err,
        finalize: () => this.isAuthLoadingSubject.next(false)
      })
    );
  }

  reset(id: string, password: string): Observable<any> {
    this.isAuthLoadingSubject.next(true);
    return this.http.post<any>(`${API_BASE_URL}/reset-password`, { id, password }).pipe(
      tap({
        next: (res: any) => res,
        error: (err: any) => err,
        finalize: () => this.isAuthLoadingSubject.next(false)
      })
    );
  }

  changePassword(id: any, old_password: string, new_password: string, confirm_password: string) {
    this.isChangeLoadingSubject.next(true);
    return this.http.post(`${API_BASE_URL}/change-password/${id}`, { old_password, new_password, confirm_password }).pipe(
      tap({
        next: (res: any) => res,
        error: (err: any) => err,
        finalize: () => this.isChangeLoadingSubject.next(false)
      })
    );
  }

  logout() {
    localStorage.removeItem('paltel-data');
    localStorage.removeItem('paltel-search');
    this.router.navigate(['/auth/login']);
  }
}
