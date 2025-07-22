import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Temoignage } from '../../shared/models/temoignage.model';

@Injectable({
  providedIn: 'root'
})
export class TemoignageService {
  private readonly endpoint = 'temoignages';

  constructor(private apiService: ApiService) {}

  getTemoignages(): Observable<Temoignage[]> {
    return this.apiService.get<Temoignage[]>(this.endpoint);
  }

  getPublishedTemoignages(): Observable<Temoignage[]> {
    return this.apiService.get<Temoignage[]>(`${this.endpoint}/published`);
  }

  getTemoignageById(id: number): Observable<Temoignage> {
    return this.apiService.get<Temoignage>(`${this.endpoint}/${id}`);
  }

  createTemoignage(temoignage: Partial<Temoignage>): Observable<Temoignage> {
    return this.apiService.post<Temoignage>(this.endpoint, temoignage);
  }

  updateTemoignage(id: number, temoignage: Partial<Temoignage>): Observable<Temoignage> {
    return this.apiService.put<Temoignage>(`${this.endpoint}/${id}`, temoignage);
  }

  deleteTemoignage(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }

  publishTemoignage(id: number): Observable<Temoignage> {
    return this.apiService.put<Temoignage>(`${this.endpoint}/${id}/publish`, {});
  }
}