import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { EcolePartenaire, EntreprisePartenaire } from '../../shared/models/partenaire.model';

@Injectable({
  providedIn: 'root'
})
export class PartenaireService {
  constructor(private apiService: ApiService) {}

  // ==================== ÉCOLES PARTENAIRES ====================
  
  /**
   * Récupère toutes les écoles partenaires
   */
  getEcolesPartenaires(): Observable<EcolePartenaire[]> {
    return this.apiService.get<EcolePartenaire[]>('ecoles-partenaires');
  }

  /**
   * Récupère les écoles partenaires par région
   */
  getEcolesPartenairesByRegion(region: string): Observable<EcolePartenaire[]> {
    return this.apiService.get<EcolePartenaire[]>(`ecoles-partenaires/region/${region}`);
  }

  /**
   * Récupère une école partenaire par ID
   */
  getEcolePartenaireById(id: number): Observable<EcolePartenaire> {
    return this.apiService.get<EcolePartenaire>(`ecoles-partenaires/${id}`);
  }

  /**
   * Recherche des écoles partenaires par mot-clé
   */
  searchEcolesPartenaires(keyword: string): Observable<EcolePartenaire[]> {
    return this.apiService.get<EcolePartenaire[]>(`ecoles-partenaires/search?keyword=${encodeURIComponent(keyword)}`);
  }

  /**
   * Compte le nombre total d'écoles partenaires
   */
  countEcolesPartenaires(): Observable<number> {
    return this.apiService.get<number>('ecoles-partenaires/count');
  }

  /**
   * Crée une nouvelle école partenaire
   */
  createEcolePartenaire(ecole: Partial<EcolePartenaire>): Observable<EcolePartenaire> {
    return this.apiService.post<EcolePartenaire>('ecoles-partenaires', ecole);
  }

  /**
   * Met à jour une école partenaire
   */
  updateEcolePartenaire(id: number, ecole: Partial<EcolePartenaire>): Observable<EcolePartenaire> {
    return this.apiService.put<EcolePartenaire>(`ecoles-partenaires/${id}`, ecole);
  }

  /**
   * Supprime une école partenaire (suppression logique)
   */
  deleteEcolePartenaire(id: number): Observable<any> {
    return this.apiService.delete(`ecoles-partenaires/${id}`);
  }

  // ==================== ENTREPRISES PARTENAIRES ====================

  /**
   * Récupère toutes les entreprises partenaires
   */
  getEntreprisesPartenaires(): Observable<EntreprisePartenaire[]> {
    return this.apiService.get<EntreprisePartenaire[]>('entreprises-partenaires');
  }

  /**
   * Récupère les entreprises partenaires par secteur
   */
  getEntreprisesPartenairesBySecteur(secteur: string): Observable<EntreprisePartenaire[]> {
    return this.apiService.get<EntreprisePartenaire[]>(`entreprises-partenaires/secteur/${secteur}`);
  }

  /**
   * Récupère une entreprise partenaire par ID
   */
  getEntreprisePartenaireById(id: number): Observable<EntreprisePartenaire> {
    return this.apiService.get<EntreprisePartenaire>(`entreprises-partenaires/${id}`);
  }

  /**
   * Recherche des entreprises partenaires par mot-clé
   */
  searchEntreprisesPartenaires(keyword: string): Observable<EntreprisePartenaire[]> {
    return this.apiService.get<EntreprisePartenaire[]>(`entreprises-partenaires/search?keyword=${encodeURIComponent(keyword)}`);
  }

  /**
   * Compte le nombre total d'entreprises partenaires
   */
  countEntreprisesPartenaires(): Observable<number> {
    return this.apiService.get<number>('entreprises-partenaires/count');
  }

  /**
   * Crée une nouvelle entreprise partenaire
   */
  createEntreprisePartenaire(entreprise: Partial<EntreprisePartenaire>): Observable<EntreprisePartenaire> {
    return this.apiService.post<EntreprisePartenaire>('entreprises-partenaires', entreprise);
  }

  /**
   * Met à jour une entreprise partenaire
   */
  updateEntreprisePartenaire(id: number, entreprise: Partial<EntreprisePartenaire>): Observable<EntreprisePartenaire> {
    return this.apiService.put<EntreprisePartenaire>(`entreprises-partenaires/${id}`, entreprise);
  }

  /**
   * Supprime une entreprise partenaire (suppression logique)
   */
  deleteEntreprisePartenaire(id: number): Observable<any> {
    return this.apiService.delete(`entreprises-partenaires/${id}`);
  }

  // ==================== MÉTHODES UTILITAIRES ====================

  /**
   * Valide les données d'une école partenaire
   */
  validateEcolePartenaire(ecole: Partial<EcolePartenaire>): string[] {
    const errors: string[] = [];

    if (!ecole.nom?.trim()) {
      errors.push('Le nom de l\'école est obligatoire');
    }

    if (!ecole.pays?.trim()) {
      errors.push('Le pays est obligatoire');
    }

    if (!ecole.ville?.trim()) {
      errors.push('La ville est obligatoire');
    }

    if (!ecole.type?.trim()) {
      errors.push('Le type d\'établissement est obligatoire');
    }

    if (!ecole.region || !['europe', 'amerique', 'afrique'].includes(ecole.region)) {
      errors.push('La région doit être: europe, amerique ou afrique');
    }

    if (ecole.emailContact && !this.isValidEmail(ecole.emailContact)) {
      errors.push('L\'email de contact n\'est pas valide');
    }

    if (ecole.siteWeb && !this.isValidUrl(ecole.siteWeb)) {
      errors.push('L\'URL du site web n\'est pas valide');
    }

    return errors;
  }

  /**
   * Valide les données d'une entreprise partenaire
   */
  validateEntreprisePartenaire(entreprise: Partial<EntreprisePartenaire>): string[] {
    const errors: string[] = [];

    if (!entreprise.nom?.trim()) {
      errors.push('Le nom de l\'entreprise est obligatoire');
    }

    if (!entreprise.secteur?.trim()) {
      errors.push('Le secteur d\'activité est obligatoire');
    }

    if (!entreprise.taille?.trim()) {
      errors.push('La taille de l\'entreprise est obligatoire');
    }

    if (!entreprise.localisation?.trim()) {
      errors.push('La localisation est obligatoire');
    }

    if (entreprise.emailContact && !this.isValidEmail(entreprise.emailContact)) {
      errors.push('L\'email de contact n\'est pas valide');
    }

    if (entreprise.siteWeb && !this.isValidUrl(entreprise.siteWeb)) {
      errors.push('L\'URL du site web n\'est pas valide');
    }

    return errors;
  }

  /**
   * Vérifie si un email est valide
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Vérifie si une URL est valide
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Formate les données d'une école avant envoi au serveur
   */
  formatEcolePartenaireForSave(ecole: Partial<EcolePartenaire>): Partial<EcolePartenaire> {
    return {
      ...ecole,
      nom: ecole.nom?.trim(),
      pays: ecole.pays?.trim(),
      ville: ecole.ville?.trim(),
      type: ecole.type?.trim(),
      description: ecole.description?.trim() || undefined,
      dureePartenariat: ecole.dureePartenariat?.trim() || undefined,
      siteWeb: ecole.siteWeb?.trim() || undefined,
      emailContact: ecole.emailContact?.trim() || undefined,
      domaines: ecole.domaines?.filter(d => d.trim()) || [],
      programmes: ecole.programmes?.filter(p => p.trim()) || [],
      avantages: ecole.avantages?.filter(a => a.trim()) || [],
      actif: ecole.actif !== undefined ? ecole.actif : true
    };
  }

  /**
   * Formate les données d'une entreprise avant envoi au serveur
   */
  formatEntreprisePartenaireForSave(entreprise: Partial<EntreprisePartenaire>): Partial<EntreprisePartenaire> {
    return {
      ...entreprise,
      nom: entreprise.nom?.trim(),
      secteur: entreprise.secteur?.trim(),
      taille: entreprise.taille?.trim(),
      localisation: entreprise.localisation?.trim(),
      typePartenariat: entreprise.typePartenariat?.trim() || undefined,
      description: entreprise.description?.trim() || undefined,
      dureePartenariat: entreprise.dureePartenariat?.trim() || undefined,
      siteWeb: entreprise.siteWeb?.trim() || undefined,
      emailContact: entreprise.emailContact?.trim() || undefined,
      responsableContact: entreprise.responsableContact?.trim() || undefined,
      collaborations: entreprise.collaborations?.filter(c => c.trim()) || [],
      postes: entreprise.postes?.filter(p => p.trim()) || [],
      avantages: entreprise.avantages?.filter(a => a.trim()) || [],
      actif: entreprise.actif !== undefined ? entreprise.actif : true
    };
  }
}