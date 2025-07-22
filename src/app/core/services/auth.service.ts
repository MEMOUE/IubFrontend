import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { User, LoginDto, AuthResponse } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    // Vérifier si l'utilisateur est déjà connecté
    this.checkCurrentUser();
  }

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('auth/login', credentials).pipe(
      tap(response => {
        this.setCurrentUser(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('rememberMe');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.apiService.post<AuthResponse>('auth/refresh', { refreshToken }).pipe(
      tap(response => {
        this.setCurrentUser(response);
      })
    );
  }

  getCurrentUser(): Observable<User> {
    return this.apiService.get<User>('auth/me');
  }

  private setCurrentUser(authResponse: AuthResponse): void {
    localStorage.setItem('authToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    localStorage.setItem('userRole', authResponse.user.role);
    this.currentUserSubject.next(authResponse.user);
  }

  private checkCurrentUser(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
  }
}