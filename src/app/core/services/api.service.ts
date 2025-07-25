import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Requête GET générique
   */
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    const options = {
      headers: this.getHeaders(),
      params: params
    };

    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Requête POST générique
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };

    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Requête PUT générique
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };

    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Requête PATCH générique
   */
  patch<T>(endpoint: string, data: any): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };

    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, data, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Requête DELETE générique
   */
  delete<T>(endpoint: string): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };

    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Upload de fichier
   */
  uploadFile<T>(endpoint: string, file: File, additionalData?: any): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);

    // Ajouter des données supplémentaires si nécessaire
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    // Ne pas définir Content-Type pour les FormData (le navigateur le fait automatiquement)
    const headers = new HttpHeaders();
    const authToken = this.getAuthToken();
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }

    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtient les headers standard
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const authToken = this.getAuthToken();
    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }

    return headers;
  }

  /**
   * Récupère le token d'authentification
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Gestion des erreurs HTTP
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = error.error.message;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Requête incorrecte';
          break;
        case 401:
          errorMessage = 'Non autorisé - Veuillez vous connecter';
          break;
        case 403:
          errorMessage = 'Accès interdit';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflit de données';
          break;
        case 422:
          errorMessage = error.error?.message || 'Données invalides';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur';
          break;
        case 503:
          errorMessage = 'Service temporairement indisponible';
          break;
        default:
          errorMessage = error.error?.message || `Erreur ${error.status}: ${error.statusText}`;
      }
    }

    console.error('Erreur API:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Construit des paramètres HTTP à partir d'un objet
   */
  buildHttpParams(params: { [key: string]: any }): HttpParams {
    let httpParams = new HttpParams();

    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => {
            httpParams = httpParams.append(`${key}[]`, item.toString());
          });
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    });

    return httpParams;
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  /**
   * Sauvegarde le token d'authentification
   */
  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  /**
   * Obtient l'URL complète pour un endpoint
   */
  getFullUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint}`;
  }

  /**
   * Télécharge un fichier
   */
  downloadFile(endpoint: string, filename?: string): Observable<Blob> {
    const options = {
      headers: this.getHeaders(),
      responseType: 'blob' as 'json'
    };

    return this.http.get<Blob>(`${this.baseUrl}/${endpoint}`, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Requête avec retry automatique
   */
  getWithRetry<T>(endpoint: string, maxRetries: number = 3): Observable<T> {
    return this.get<T>(endpoint).pipe(
      catchError((error, caught) => {
        if (maxRetries > 0 && error.status >= 500) {
          console.log(`Tentative de nouvelle requête (${maxRetries} restantes)`);
          return this.getWithRetry<T>(endpoint, maxRetries - 1);
        }
        return throwError(() => error);
      })
    );
  }
}