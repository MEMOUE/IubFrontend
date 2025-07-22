import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { EcolePartenaire, EntreprisePartenaire } from '../../shared/models/partenaire.model';

@Injectable({
  providedIn: 'root'
})
export class PartenaireService {
  constructor(private apiService: ApiService) {}

  // Écoles partenaires
  getEcolesPartenaires(): Observable<EcolePartenaire[]> {
    return this.apiService.get<EcolePartenaire[]>('ecoles-partenaires');
  }

  getEcolesPartenairesByRegion(region: string): Observable<EcolePartenaire[]> {
    return this.apiService.get<EcolePartenaire[]>(`ecoles-partenaires/region/${region}`);
  }

  getEcolePartenaireById(id: number): Observable<EcolePartenaire> {
    return this.apiService.get<EcolePartenaire>(`ecoles-partenaires/${id}`);
  }

  createEcolePartenaire(ecole: Partial<EcolePartenaire>): Observable<EcolePartenaire> {
    return this.apiService.post<EcolePartenaire>('ecoles-partenaires', ecole);
  }

  updateEcolePartenaire(id: number, ecole: Partial<EcolePartenaire>): Observable<EcolePartenaire> {
    return this.apiService.put<EcolePartenaire>(`ecoles-partenaires/${id}`, ecole);
  }

  deleteEcolePartenaire(id: number): Observable<any> {
    return this.apiService.delete(`ecoles-partenaires/${id}`);
  }

  // Entreprises partenaires
  getEntreprisesPartenaires(): Observable<EntreprisePartenaire[]> {
    return this.apiService.get<EntreprisePartenaire[]>('entreprises-partenaires');
  }

  getEntreprisesPartenairesBySecteur(secteur: string): Observable<EntreprisePartenaire[]> {
    return this.apiService.get<EntreprisePartenaire[]>(`entreprises-partenaires/secteur/${secteur}`);
  }

  getEntreprisePartenaireById(id: number): Observable<EntreprisePartenaire> {
    return this.apiService.get<EntreprisePartenaire>(`entreprises-partenaires/${id}`);
  }

  createEntreprisePartenaire(entreprise: Partial<EntreprisePartenaire>): Observable<EntreprisePartenaire> {
    return this.apiService.post<EntreprisePartenaire>('entreprises-partenaires', entreprise);
  }

  updateEntreprisePartenaire(id: number, entreprise: Partial<EntreprisePartenaire>): Observable<EntreprisePartenaire> {
    return this.apiService.put<EntreprisePartenaire>(`entreprises-partenaires/${id}`, entreprise);
  }

  deleteEntreprisePartenaire(id: number): Observable<any> {
    return this.apiService.delete(`entreprises-partenaires/${id}`);
  }
}