import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Actualite, CreateActualiteDto } from '../../shared/models/actualite.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActualiteService {
  private apiUrl = `${environment.apiUrl}/actualites`;

  constructor(private http: HttpClient) {}

  // Méthode améliorée avec gestion d'erreurs
  getActualites(): Observable<Actualite[]> {
    return this.http.get<Actualite[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getActualiteById(id: number): Observable<Actualite> {
    return this.http.get<Actualite>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createActualite(actualite: CreateActualiteDto): Observable<Actualite> {
    return this.http.post<Actualite>(this.apiUrl, actualite)
      .pipe(catchError(this.handleError));
  }

  updateActualite(id: number, actualite: CreateActualiteDto): Observable<Actualite> {
    return this.http.put<Actualite>(`${this.apiUrl}/${id}`, actualite)
      .pipe(catchError(this.handleError));
  }

  deleteActualite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  publierActualite(id: number): Observable<Actualite> {
    return this.http.put<Actualite>(`${this.apiUrl}/${id}/publier`, {})
      .pipe(catchError(this.handleError));
  }

  searchActualites(keyword: string): Observable<Actualite[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Actualite[]>(`${this.apiUrl}/search`, { params })
      .pipe(catchError(this.handleError));
  }

  getActualitesByCategorie(categorie: string): Observable<Actualite[]> {
    return this.http.get<Actualite[]>(`${this.apiUrl}/categorie/${categorie}`)
      .pipe(catchError(this.handleError));
  }

  // Gestion centralisée des erreurs
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      if (error.status === 400 && error.error?.errors) {
        // Erreurs de validation du backend
        const validationErrors = Object.values(error.error.errors).join(', ');
        errorMessage = `Erreur de validation: ${validationErrors}`;
      } else {
        errorMessage = error.error?.error || `Erreur ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Erreur HTTP:', error);
    return throwError(() => new Error(errorMessage));
  }
}