import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingRequestsMap = new Map<string, boolean>();

  /**
   * Observable pour suivre l'état de chargement global
   */
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {}

  /**
   * Active ou désactive le loading pour une URL spécifique
   */
  setLoading(loading: boolean, url?: string): void {
    if (url) {
      if (loading) {
        this.loadingRequestsMap.set(url, loading);
      } else {
        this.loadingRequestsMap.delete(url);
      }
    }

    // Mettre à jour l'état global
    const hasActiveRequests = this.loadingRequestsMap.size > 0;
    
    if (this.loadingSubject.value !== hasActiveRequests) {
      this.loadingSubject.next(hasActiveRequests);
    }
  }

  /**
   * Obtient l'état de chargement actuel
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Force l'arrêt de tous les chargements
   */
  stopAllLoading(): void {
    this.loadingRequestsMap.clear();
    this.loadingSubject.next(false);
  }

  /**
   * Obtient le nombre de requêtes en cours
   */
  getActiveRequestsCount(): number {
    return this.loadingRequestsMap.size;
  }

  /**
   * Vérifie si une URL spécifique est en cours de chargement
   */
  isUrlLoading(url: string): boolean {
    return this.loadingRequestsMap.has(url);
  }

  /**
   * Active le loading manuellement
   */
  show(): void {
    this.setLoading(true, 'manual');
  }

  /**
   * Désactive le loading manuel
   */
  hide(): void {
    this.setLoading(false, 'manual');
  }

  /**
   * Exécute une fonction avec loading automatique
   */
  withLoading<T>(operation: () => Observable<T>): Observable<T> {
    this.show();
    
    return new Observable<T>(subscriber => {
      const subscription = operation().subscribe({
        next: value => subscriber.next(value),
        error: error => {
          this.hide();
          subscriber.error(error);
        },
        complete: () => {
          this.hide();
          subscriber.complete();
        }
      });

      return () => subscription.unsubscribe();
    });
  }
}