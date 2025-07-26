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

export interface DirecteurStatus {
  existeDirecteurActif: boolean;
  nombreTotalDirecteurs: number;
  nombreDirecteursActifs: number;
}

export interface DirecteurConflictResponse {
  message?: string;
  directeurActuel?: Directeur;
  warning?: boolean;
  error?: string;
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
  createDirecteur(directeur: Directeur): Observable<Directeur | DirecteurConflictResponse> {
    return this.http.post<Directeur | DirecteurConflictResponse>(this.apiUrl, directeur)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Force la création d'un directeur (remplace l'existant)
   */
  forceCreateDirecteur(directeur: Directeur): Observable<Directeur> {
    return this.http.post<Directeur>(`${this.apiUrl}/force`, directeur)
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
   * Supprime un directeur (suppression logique)
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
  getDirecteurStatus(): Observable<DirecteurStatus> {
    return this.http.get<DirecteurStatus>(`${this.apiUrl}/status`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Vérifie s'il existe déjà un directeur actif
   */
  checkDirecteurExists(): Observable<boolean> {
    return new Observable(observer => {
      this.getDirecteurStatus().subscribe({
        next: (status) => {
          observer.next(status.existeDirecteurActif);
          observer.complete();
        },
        error: (error) => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  /**
   * Construit l'URL complète de la photo du directeur (comme pour les actualités)
   */
  getPhotoUrl(directeur: Directeur | null): string {
    if (!directeur?.photoUrl) {
      return 'assets/images/default-director.jpg';
    }

    // Si l'URL commence par http ou https, l'utiliser telle quelle
    if (directeur.photoUrl.startsWith('http')) {
      return directeur.photoUrl;
    }

    // Si l'URL commence par /uploads, construire l'URL complète
    if (directeur.photoUrl.startsWith('/uploads')) {
      return `${environment.apiUrl.replace('/api', '')}${directeur.photoUrl}`;
    }

    // Si c'est juste le nom du fichier, construire l'URL complète
    if (!directeur.photoUrl.startsWith('/')) {
      return `${environment.apiUrl.replace('/api', '')}/uploads/directeurs/${directeur.photoUrl}`;
    }

    // Par défaut, construire l'URL complète
    return `${environment.apiUrl.replace('/api', '')}${directeur.photoUrl}`;
  }

  /**
   * Vérifie si une image existe et est accessible
   */
  checkImageExists(imageUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
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
    
    return throwError(() => error);
  }
}