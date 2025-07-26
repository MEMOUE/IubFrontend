import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Directeur {
  id?: number;
  nom: string;
  titre: string;
  photoUrl?: string;
  experience?: string;
  diplomes?: string[];
  messageBienvenue?: string;
  messageVision?: string;
  messageEngagements?: string;
  messageEtudiants?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  linkedinUrl?: string;
  actif?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DirecteurService {
  private apiUrl = `${environment.apiUrl}/directeur`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère le directeur actuel
   */
  getCurrentDirecteur(): Observable<Directeur> {
    return this.http.get<Directeur>(`${this.apiUrl}/current`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Récupère tous les directeurs
   */
  getAllDirecteurs(): Observable<Directeur[]> {
    return this.http.get<Directeur[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Récupère un directeur par ID
   */
  getDirecteurById(id: number): Observable<Directeur> {
    return this.http.get<Directeur>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Crée un nouveau directeur
   */
  createDirecteur(directeur: Directeur): Observable<Directeur> {
    return this.http.post<Directeur>(this.apiUrl, directeur)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Met à jour un directeur
   */
  updateDirecteur(id: number, directeur: Directeur): Observable<Directeur> {
    return this.http.put<Directeur>(`${this.apiUrl}/${id}`, directeur)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Active un directeur
   */
  activerDirecteur(id: number): Observable<Directeur> {
    return this.http.put<Directeur>(`${this.apiUrl}/${id}/activer`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Supprime un directeur
   */
  deleteDirecteur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Récupère le statut des directeurs
   */
  getDirecteurStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/status`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Gestion des erreurs
   */
  private handleError(error: any) {
    console.error('Erreur dans DirecteurService:', error);
    
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}