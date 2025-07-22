import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Actualite, CreateActualiteDto } from '../../shared/models/actualite.model';
import { PaginatedResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ActualiteService {
  private readonly endpoint = 'actualites';

  constructor(private apiService: ApiService) {}

  getActualites(params?: any): Observable<Actualite[]> {
    return this.apiService.get<Actualite[]>(this.endpoint, params);
  }

  getActualitesPaginated(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Actualite>> {
    return this.apiService.getPaginated<Actualite>(this.endpoint, { page, limit });
  }

  getActualiteById(id: number): Observable<Actualite> {
    return this.apiService.get<Actualite>(`${this.endpoint}/${id}`);
  }

  createActualite(actualite: CreateActualiteDto): Observable<Actualite> {
    return this.apiService.post<Actualite>(this.endpoint, actualite);
  }

  updateActualite(id: number, actualite: Partial<Actualite>): Observable<Actualite> {
    return this.apiService.put<Actualite>(`${this.endpoint}/${id}`, actualite);
  }

  deleteActualite(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }

  getRecentActualites(limit: number = 5): Observable<Actualite[]> {
    return this.apiService.get<Actualite[]>(`${this.endpoint}/recent`, { limit });
  }
}