// src/app/core/services/formation.service.ts

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

  // ✅ CORRIGÉ - Obtenir les statistiques réelles pour TOUS les niveaux universitaires
  getFormationStats(): Observable<FormationStats> {
    return new Observable(observer => {
      console.log('📊 Début du calcul des statistiques...');
      
      // Récupérer toutes les formations en une seule fois pour calculer les stats
      this.getAllFormations().subscribe({
        next: (formations) => {
          console.log(`📋 ${formations.length} formations récupérées du backend`);
          
          // Calculer les statistiques pour toutes les catégories
          const stats: FormationStats = {
            totalFormations: formations.filter(f => f.actif && f.disponible).length,
            
            // ✅ BTS/DUT (Bac+2)
            formationsBTS: formations.filter(f => 
              f.categorie === 'bts_dut' && f.actif && f.disponible
            ).length,
            
            // ✅ Licences (Bac+3) - Licence générale + Licence Pro
            formationsLicence: formations.filter(f => 
              (f.categorie === 'licence' || f.categorie === 'licence_pro') && f.actif && f.disponible
            ).length,
            
            // ✅ Masters (Bac+5) - Master général + Master Pro  
            formationsMaster: formations.filter(f => 
              (f.categorie === 'master' || f.categorie === 'master_pro') && f.actif && f.disponible
            ).length,
            
            // ✅ MBA
            formationsMBA: formations.filter(f => 
              f.categorie === 'mba' && f.actif && f.disponible
            ).length,
            
            // ✅ Doctorats (Bac+8)
            formationsDoctorat: formations.filter(f => 
              f.categorie === 'doctorat' && f.actif && f.disponible
            ).length,
            
            // ✅ Certifications + Formation Continue
            formationsCertification: formations.filter(f => 
              (f.categorie === 'certification' || f.categorie === 'formation_continue') && f.actif && f.disponible
            ).length,
            
            // Taux d'insertion (à adapter selon vos métriques réelles)
            tauxInsertion: 95
          };
          
          // Debug des statistiques calculées
          console.log('📊 Statistiques calculées par catégorie:');
          console.log(`  📚 Total formations actives: ${stats.totalFormations}`);
          console.log(`  🎓 BTS/DUT: ${stats.formationsBTS}`);
          console.log(`  🎓 Licences: ${stats.formationsLicence}`);
          console.log(`  🎓 Masters: ${stats.formationsMaster}`);
          console.log(`  🎓 MBA: ${stats.formationsMBA}`);
          console.log(`  🎓 Doctorats: ${stats.formationsDoctorat}`);
          console.log(`  🎓 Certifications: ${stats.formationsCertification}`);
          console.log(`  📈 Taux insertion: ${stats.tauxInsertion}%`);
          
          observer.next(stats);
          observer.complete();
        },
        error: (error) => {
          console.error('❌ Erreur lors du calcul des statistiques:', error);
          
          // En cas d'erreur, retourner des stats par défaut
          const defaultStats: FormationStats = {
            totalFormations: 0,
            formationsBTS: 0,
            formationsLicence: 0,
            formationsMaster: 0,
            formationsMBA: 0,
            formationsDoctorat: 0,
            formationsCertification: 0,
            tauxInsertion: 95
          };
          
          observer.next(defaultStats);
          observer.complete();
        }
      });
    });
  }

  // ✅ Méthode utilitaire pour obtenir les formations par catégories multiples
  getFormationsByCategories(categories: string[]): Observable<Formation[]> {
    return new Observable(observer => {
      this.getAllFormations().subscribe({
        next: (formations) => {
          const filtered = formations.filter(f => 
            categories.includes(f.categorie) && f.actif && f.disponible
          );
          observer.next(filtered);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  // ✅ Méthode pour obtenir un résumé des catégories disponibles
  getCategoriesSummary(): Observable<Array<{categorie: string, count: number, label: string}>> {
    return new Observable(observer => {
      this.getAllFormations().subscribe({
        next: (formations) => {
          const categoriesMap = new Map<string, number>();
          const labelMap = new Map<string, string>([
            ['bts_dut', 'BTS/DUT (Bac+2)'],
            ['licence', 'Licence (Bac+3)'],
            ['licence_pro', 'Licence Pro (Bac+3)'],
            ['master', 'Master (Bac+5)'],
            ['master_pro', 'Master Pro (Bac+5)'],
            ['mba', 'MBA'],
            ['doctorat', 'Doctorat (Bac+8)'],
            ['formation_continue', 'Formation Continue'],
            ['certification', 'Certification']
          ]);

          // Compter les formations par catégorie
          formations.filter(f => f.actif && f.disponible).forEach(formation => {
            const count = categoriesMap.get(formation.categorie) || 0;
            categoriesMap.set(formation.categorie, count + 1);
          });

          // Convertir en tableau avec labels
          const summary = Array.from(categoriesMap.entries()).map(([categorie, count]) => ({
            categorie,
            count,
            label: labelMap.get(categorie) || categorie
          }));

          observer.next(summary);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}