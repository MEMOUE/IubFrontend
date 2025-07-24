import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services et modèles
import { FormationService } from '../../../core/services/formation.service';
import { Formation, FormationStats } from '../../../shared/models/formation.model';

@Component({
  selector: 'app-listeformation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SkeletonModule,
    MessageModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './listeformation.component.html',
  styleUrl: './listeformation.component.css'
})
export class ListeformationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // État du composant
  loading = true;
  formations: Formation[] = [];
  formationsFiltered: Formation[] = [];
  searchKeyword = '';
  categorieActive = 'all';
  error: string | null = null;

  // Statistiques
  stats: FormationStats = {
    totalFormations: 0,
    formationsBTS: 0,
    formationsLicence: 0,
    formationsMaster: 0,
    formationsMBA: 0,
    formationsDoctorat: 0,
    formationsCertification: 0,
    tauxInsertion: 95
  };

  // Statistiques à afficher
  statistiques: Array<{valeur: string; label: string}> = [];

  constructor(
    private formationService: FormationService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Charger toutes les données
  loadData() {
    this.loading = true;
    this.error = null;

    // Charger formations et statistiques en parallèle
    forkJoin({
      formations: this.formationService.getAllFormations(),
      stats: this.formationService.getFormationStats()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.formations = data.formations;
        this.formationsFiltered = [...this.formations];
        this.stats = data.stats;
        this.updateStatistiques();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des formations:', error);
        this.error = 'Erreur lors du chargement des formations';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les formations',
          life: 5000
        });
      }
    });
  }

  // Mettre à jour les statistiques affichées
  updateStatistiques() {
    this.statistiques = [
      { valeur: this.stats.totalFormations.toString(), label: 'Formations disponibles' },
      { valeur: `${this.stats.tauxInsertion}%`, label: 'Taux d\'insertion professionnelle' },
      { valeur: this.stats.formationsBTS.toString(), label: 'BTS/DUT' },
      { valeur: this.stats.formationsLicence.toString(), label: 'Licences' },
      { valeur: this.stats.formationsMaster.toString(), label: 'Masters' },
      { valeur: this.stats.formationsMBA.toString(), label: 'MBA' },
      { valeur: this.stats.formationsDoctorat.toString(), label: 'Doctorats' },
      { valeur: this.stats.formationsCertification.toString(), label: 'Certifications' }
    ];
  }

  // Changer de catégorie
  changerCategorie(categorie: string) {
    this.categorieActive = categorie;
    this.filterFormations();
  }

  // Rechercher des formations
  onSearch() {
    if (this.searchKeyword.trim()) {
      this.loading = true;
      this.formationService.searchFormations(this.searchKeyword.trim())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (formations) => {
            this.formationsFiltered = formations;
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors de la recherche:', error);
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la recherche',
              life: 3000
            });
          }
        });
    } else {
      this.formationsFiltered = [...this.formations];
      this.filterFormations();
    }
  }

  // Effacer la recherche
  clearSearch() {
    this.searchKeyword = '';
    this.formationsFiltered = [...this.formations];
    this.filterFormations();
  }

  // Filtrer les formations par catégorie
  filterFormations() {
    if (this.categorieActive === 'all') {
      this.formationsFiltered = [...this.formations];
    } else {
      this.formationsFiltered = this.formations.filter(
        formation => formation.categorie === this.categorieActive
      );
    }
  }

  // Obtenir les formations actives avec filtres appliqués
  getFormationsActives(): Formation[] {
    return this.formationsFiltered.filter(formation => 
      formation.actif && formation.disponible
    );
  }

  // Formater le prix
  formatPrice(price: number | undefined): string {
    if (!price) return 'Prix non défini';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  }

  // Obtenir le pourcentage de places occupées
  getOccupancyPercentage(formation: Formation): number {
    if (!formation.nombrePlaces || formation.nombrePlaces === 0) return 0;
    return Math.round((formation.nombreInscrits || 0) / formation.nombrePlaces * 100);
  }

  // Vérifier si une formation est presque complète
  isNearlyFull(formation: Formation): boolean {
    return this.getOccupancyPercentage(formation) >= 80;
  }

  // Navigation vers les détails d'une formation
  voirDetails(formationId: number) {
    this.router.navigate(['/formations/details', formationId]);
  }

  // S'inscrire à une formation
  inscrireFormation(formation: Formation) {
    if (!formation.nombrePlaces || (formation.nombreInscrits || 0) >= formation.nombrePlaces) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formation complète',
        detail: 'Cette formation n\'a plus de places disponibles',
        life: 3000
      });
      return;
    }

    this.formationService.inscrireEtudiant(formation.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedFormation) => {
          // Mettre à jour la formation dans la liste
          const index = this.formations.findIndex(f => f.id === formation.id);
          if (index !== -1) {
            this.formations[index] = updatedFormation;
            this.filterFormations();
          }
          
          this.messageService.add({
            severity: 'success',
            summary: 'Inscription réussie',
            detail: `Vous êtes inscrit(e) à la formation "${formation.nom}"`,
            life: 3000
          });
        },
        error: (error) => {
          console.error('Erreur lors de l\'inscription:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur d\'inscription',
            detail: 'Impossible de procéder à l\'inscription',
            life: 3000
          });
        }
      });
  }

  // Navigation vers contact
  navigateToContact() {
    this.router.navigate(['/contacts']);
  }

  // Navigation vers présentation
  navigateToPresentation() {
    this.router.navigate(['/universite/presentation']);
  }

  // Navigation vers création de formation (pour admin)
  navigateToCreateFormation() {
    this.router.navigate(['/formations/nouveau']);
  }

  // TrackBy function pour optimiser le rendu
  trackByFormationId(index: number, formation: Formation): number {
    return formation.id;
  }

  // Obtenir le label de la catégorie
  getCategorieLabel(categorie: string): string {
    const labels: { [key: string]: string } = {
      'bts_dut': 'BTS/DUT (Bac+2)',
      'licence': 'Licence (Bac+3)',
      'licence_pro': 'Licence Pro (Bac+3)',
      'master': 'Master (Bac+5)',
      'master_pro': 'Master Pro (Bac+5)',
      'mba': 'MBA',
      'doctorat': 'Doctorat (Bac+8)',
      'formation_continue': 'Formation Continue',
      'certification': 'Certification'
    };
    return labels[categorie] || categorie;
  }

  // Obtenir les catégories disponibles avec leurs compteurs
  getCategoriesAvailables(): Array<{key: string, label: string, count: number}> {
    const categories = [
      { key: 'all', label: 'Toutes', count: this.formations.length },
      { key: 'bts_dut', label: 'BTS/DUT', count: 0 },
      { key: 'licence', label: 'Licence', count: 0 },
      { key: 'licence_pro', label: 'Licence Pro', count: 0 },
      { key: 'master', label: 'Master', count: 0 },
      { key: 'master_pro', label: 'Master Pro', count: 0 },
      { key: 'mba', label: 'MBA', count: 0 },
      { key: 'doctorat', label: 'Doctorat', count: 0 },
      { key: 'formation_continue', label: 'Formation Continue', count: 0 },
      { key: 'certification', label: 'Certification', count: 0 }
    ];

    // Compter les formations par catégorie
    this.formations.forEach(formation => {
      const category = categories.find(cat => cat.key === formation.categorie);
      if (category) {
        category.count++;
      }
    });

    // Retourner seulement les catégories qui ont des formations
    return categories.filter(cat => cat.key === 'all' || cat.count > 0);
  }
}