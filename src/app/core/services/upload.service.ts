// src/app/core/services/upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface UploadResponse {
  url: string;
  filename: string;
  message: string;
  originalName?: string;
  size?: number;
}

export interface FileValidation {
  valid: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private readonly apiUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  /**
   * Upload d'image pour actualité (méthode existante)
   */
  uploadActualiteImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<UploadResponse>(`${this.apiUrl}/actualite/image`, formData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Upload de photo pour directeur (méthode existante)
   */
  uploadDirecteurPhoto(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<UploadResponse>(`${this.apiUrl}/directeur/photo`, formData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Upload avec suivi de progression
   */
  uploadWithProgress(file: File, endpoint: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/${endpoint}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / (event.total || 1));
            return { status: 'progress', progress };
          case HttpEventType.Response:
            return { status: 'complete', body: event.body };
          default:
            return { status: 'uploading' };
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Validation côté client
   */
  validateFile(file: File): FileValidation {
    // Taille maximale : 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: 'Le fichier est trop volumineux (max 5MB)' };
    }

    // Types autorisés
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WebP' };
    }

    return { valid: true };
  }

  /**
   * Générer une preview locale du fichier
   */
  generatePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Formater la taille du fichier
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue lors de l\'upload';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = error.error.message;
    } else {
      // Erreur côté serveur
      if (error.status === 413) {
        errorMessage = 'Fichier trop volumineux (max 5MB)';
      } else if (error.status === 415) {
        errorMessage = 'Type de fichier non supporté';
      } else if (error.error?.error) {
        errorMessage = error.error.error;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Erreur upload:', error);
    return throwError(() => new Error(errorMessage));
  }
}