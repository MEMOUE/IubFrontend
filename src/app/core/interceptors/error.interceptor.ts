import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Une erreur est survenue';

        if (error.status === 401) {
          // Token expiré ou invalide
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          this.router.navigate(['/admin/login']);
          errorMessage = 'Session expirée, veuillez vous reconnecter';
        } else if (error.status === 403) {
          errorMessage = 'Accès non autorisé';
        } else if (error.status === 404) {
          errorMessage = 'Ressource non trouvée';
        } else if (error.status === 500) {
          errorMessage = 'Erreur serveur interne';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        // Afficher le message d'erreur
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: errorMessage,
          life: 5000
        });

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}