import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Formation, CreateFormationDto } from '../../shared/models/formation.model';
import { PaginatedResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private readonly endpoint = 'formations';

  constructor(private apiService: ApiService) {}

  // Récupérer toutes les formations
  getFormations(params?: any): Observable<Formation[]> {
    return this.apiService.get<Formation[]>(this.endpoint, params);
  }

  // Récupérer les formations paginées
  getFormationsPaginated(page: number = 1, limit: number = 10, filters?: any): Observable<PaginatedResponse<Formation>> {
    const params = { page, limit, ...filters };
    return this.apiService.getPaginated<Formation>(this.endpoint, params);
  }

  // Récupérer une formation par ID
  getFormationById(id: number): Observable<Formation> {
    return this.apiService.get<Formation>(`${this.endpoint}/${id}`);
  }

  // Créer une nouvelle formation
  createFormation(formation: CreateFormationDto): Observable<Formation> {
    return this.apiService.post<Formation>(this.endpoint, formation);
  }

  // Mettre à jour une formation
  updateFormation(id: number, formation: Partial<Formation>): Observable<Formation> {
    return this.apiService.put<Formation>(`${this.endpoint}/${id}`, formation);
  }

  // Supprimer une formation
  deleteFormation(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }

  // Récupérer les formations par niveau
  getFormationsByNiveau(niveau: 'licence' | 'master'): Observable<Formation[]> {
    return this.apiService.get<Formation[]>(`${this.endpoint}/niveau/${niveau}`);
  }
}