import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation, CreateFormationDto, FormationStats } from '../../shared/models/formation.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private readonly baseUrl = `${environment.apiUrl}/formations`;

  constructor(private http: HttpClient) {}

  // Récupérer toutes les formations
  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.baseUrl);
  }

  // Récupérer une formation par ID
  getFormationById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.baseUrl}/${id}`);
  }

  // Récupérer les formations par catégorie
  getFormationsByCategorie(categorie: string): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.baseUrl}/categorie/${categorie}`);
  }

  // Rechercher des formations par mot-clé
  searchFormations(keyword: string): Observable<Formation[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Formation[]>(`${this.baseUrl}/search`, { params });
  }

  // Compter le nombre de formations
  countFormations(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  // Créer une nouvelle formation
  createFormation(formation: CreateFormationDto): Observable<Formation> {
    return this.http.post<Formation>(this.baseUrl, formation);
  }

  // Mettre à jour une formation
  updateFormation(id: number, formation: Partial<Formation>): Observable<Formation> {
    return this.http.put<Formation>(`${this.baseUrl}/${id}`, formation);
  }

  // Inscrire un étudiant à une formation
  inscrireEtudiant(id: number): Observable<Formation> {
    return this.http.put<Formation>(`${this.baseUrl}/${id}/inscrire`, {});
  }

  // Supprimer une formation
  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Obtenir les statistiques des formations
  getFormationStats(): Observable<FormationStats> {
    // Cette méthode combine plusieurs appels pour obtenir les statistiques
    // En production, vous pourriez créer un endpoint dédié côté backend
    return new Observable(observer => {
      this.countFormations().subscribe(total => {
        this.getFormationsByCategorie('licence').subscribe(licences => {
          this.getFormationsByCategorie('master').subscribe(masters => {
            const stats: FormationStats = {
              totalFormations: total,
              formationsLicence: licences.length,
              formationsMaster: masters.length,
              tauxInsertion: 95 // Valeur statique, à adapter selon vos besoins
            };
            observer.next(stats);
            observer.complete();
          });
        });
      });
    });
  }
}