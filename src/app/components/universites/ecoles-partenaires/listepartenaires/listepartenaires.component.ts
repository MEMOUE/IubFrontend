import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';

// Services et modèles
import { PartenaireService } from '../../../../core/services/partenaire.service';
import { EcolePartenaire, StatistiquePartenaire } from '../../../../shared/models/partenaire.model';

@Component({
  selector: 'app-listepartenaires',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    TagModule
  ],
  providers: [MessageService],
  templateUrl: './listepartenaires.component.html',
  styleUrl: './listepartenaires.component.css'
})
export class ListepartenairesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Données
  partenaires: EcolePartenaire[] = [];
  partenairesFiltres: EcolePartenaire[] = [];
  statistiques: StatistiquePartenaire[] = [];
  
  // État du composant
  loading = false;
  regionActive = 'europe';
  
  // Régions disponibles
  regions = [
    { code: 'europe', label: 'Europe', icon: 'pi pi-globe' },
    { code: 'amerique', label: 'Amérique', icon: 'pi pi-flag' },
    { code: 'afrique', label: 'Afrique', icon: 'pi pi-sun' }
  ];

  constructor(
    private router: Router,
    private partenaireService: PartenaireService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.chargerDonnees();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge toutes les données nécessaires
   */
  chargerDonnees() {
    this.loading = true;
    
    forkJoin({
      partenaires: this.partenaireService.getEcolesPartenaires(),
      count: this.partenaireService.countEcolesPartenaires()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.partenaires = data.partenaires;
        this.filtrerParRegion(this.regionActive);
        this.calculerStatistiques(data.count);
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Erreur lors du chargement des partenaires:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les écoles partenaires'
        });
        this.loading = false;
      }
    });
  }

  /**
   * Change de région et filtre les partenaires
   */
  changerRegion(region: string) {
    this.regionActive = region;
    this.filtrerParRegion(region);
  }

  /**
   * Filtre les partenaires par région
   */
  private filtrerParRegion(region: string) {
    this.partenairesFiltres = this.partenaires.filter(
      (partenaire: EcolePartenaire) => partenaire.region === region
    );
  }

  /**
   * Calcule les statistiques à afficher
   */
  private calculerStatistiques(totalCount: number) {
    const paysUniques = new Set(this.partenaires.map((p: EcolePartenaire) => p.pays)).size;
    const totalProgrammes = this.partenaires.reduce((acc: number, p: EcolePartenaire) => acc + (p.programmes?.length || 0), 0);
    
    this.statistiques = [
      { valeur: totalCount, label: 'Écoles partenaires' },
      { valeur: paysUniques, label: 'Pays représentés' },
      { valeur: totalProgrammes, label: 'Programmes disponibles' },
      { valeur: '500+', label: 'Étudiants en échange' }
    ];
  }

  /**
   * Navigation vers les détails d'un partenaire
   */
  voirDetails(partenaireId: number) {
    this.router.navigate(['/universite/ecoles-partenaires/details/', partenaireId]);
  }

  /**
   * Navigation vers la création d'un nouveau partenaire
   */
  /* ajouterPartenaire() {
    this.router.navigate(['/universites/ecoles-partenaires/nouveau']);
  } */

  /**
   * Navigation vers l'édition d'un partenaire
   */
  modifierPartenaire(partenaireId: number) {
    this.router.navigate(['universite/ecoles-partenaires/modifier/', partenaireId]);
  }

  /**
   * Suppression d'un partenaire
   */
  supprimerPartenaire(partenaire: EcolePartenaire, event: Event) {
    event.stopPropagation();
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'école "${partenaire.nom}" ?`)) {
      this.partenaireService.deleteEcolePartenaire(partenaire.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'École partenaire supprimée avec succès'
            });
            this.chargerDonnees(); // Recharger les données
          },
          error: (error: Error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible de supprimer l\'école partenaire'
            });
          }
        });
    }
  }

  /**
   * Navigation vers contact
   */
  navigateToContact() {
    this.router.navigate(['/contacts']);
  }

  /**
   * Navigation vers formations
   */
  navigateToFormations() {
    this.router.navigate(['/formations']);
  }

  /**
   * Recherche par mot-clé
   */
  rechercherPartenaires(keyword: string) {
    if (!keyword.trim()) {
      this.filtrerParRegion(this.regionActive);
      return;
    }

    this.partenaireService.searchEcolesPartenaires(keyword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (partenaires: EcolePartenaire[]) => {
          this.partenairesFiltres = partenaires.filter(
            (p: EcolePartenaire) => p.region === this.regionActive
          );
        },
        error: (error: Error) => {
          console.error('Erreur lors de la recherche:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la recherche'
          });
        }
      });
  }

  /**
   * Obtient la couleur pour un tag de domaine
   */
  getDomaineTagSeverity(index: number): string {
    const severities = ['success', 'info', 'warning', 'danger', 'secondary'];
    return severities[index % severities.length];
  }

  /**
   * Formate la durée du partenariat
   */
  formatDureePartenariat(duree: string | undefined): string {
    return duree || 'Non spécifiée';
  }

  /**
   * Vérifie si un partenaire a des informations de contact
   */
  hasContactInfo(partenaire: EcolePartenaire): boolean {
    return !!(partenaire.emailContact || partenaire.siteWeb);
  }
}