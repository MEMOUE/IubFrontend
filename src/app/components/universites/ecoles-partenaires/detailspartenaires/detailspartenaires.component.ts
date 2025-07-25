import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';

// Services et modèles
import { PartenaireService } from '../../../../core/services/partenaire.service';
import { EcolePartenaire } from '../../../../shared/models/partenaire.model';

@Component({
  selector: 'app-detailspartenaires',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    DividerModule,
    ToastModule,
    ProgressSpinnerModule,
    ChipModule,
    AvatarModule
  ],
  providers: [MessageService],
  templateUrl: './detailspartenaires.component.html',
  styleUrl: './detailspartenaires.component.css'
})
export class DetailspartenairesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Données
  partenaire: EcolePartenaire | null = null;
  partenaireId: number | null = null;
  
  // État du composant
  loading = false;
  error = false;

  // Configuration des régions
  regionConfig = {
    europe: {
      label: 'Europe',
      icon: 'pi pi-globe',
      color: '#3B82F6',
      description: 'Partenariat européen'
    },
    amerique: {
      label: 'Amérique',
      icon: 'pi pi-flag',
      color: '#EF4444',
      description: 'Partenariat américain'
    },
    afrique: {
      label: 'Afrique',
      icon: 'pi pi-sun',
      color: '#F59E0B',
      description: 'Partenariat africain'
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private partenaireService: PartenaireService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.partenaireId = +params['id'];
        this.chargerPartenaire(this.partenaireId);
      } else {
        this.router.navigate(['/universites/ecoles-partenaires']);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge les données du partenaire
   */
  private chargerPartenaire(id: number) {
    this.loading = true;
    this.error = false;
    
    this.partenaireService.getEcolePartenaireById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (partenaire) => {
          this.partenaire = partenaire;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement du partenaire:', error);
          this.error = true;
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les informations du partenaire'
          });
        }
      });
  }

  /**
   * Retourne à la liste des partenaires
   */
  retourListe() {
    this.router.navigate(['/universite/ecoles-partenaires']);
  }

  /**
   * Navigation vers l'édition
   */
  modifierPartenaire() {
    if (this.partenaireId) {
      this.router.navigate(['universite/ecoles-partenaires/modifier/', this.partenaireId]);
    }
  }

  /**
   * Supprime le partenaire
   */
  supprimerPartenaire() {
    if (!this.partenaire || !this.partenaireId) return;

    const confirmation = confirm(
      `Êtes-vous sûr de vouloir supprimer l'école "${this.partenaire.nom}" ?\n\nCette action est irréversible.`
    );

    if (confirmation) {
      this.loading = true;
      
      this.partenaireService.deleteEcolePartenaire(this.partenaireId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'École partenaire supprimée avec succès'
            });
            
            setTimeout(() => {
              this.router.navigate(['/universites/ecoles-partenaires']);
            }, 1500);
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible de supprimer l\'école partenaire'
            });
            this.loading = false;
          }
        });
    }
  }

  /**
   * Ouvre le site web du partenaire
   */
  ouvrirSiteWeb() {
    if (this.partenaire?.siteWeb) {
      window.open(this.partenaire.siteWeb, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Ouvre l'email de contact
   */
  envoyerEmail() {
    if (this.partenaire?.emailContact) {
      window.location.href = `mailto:${this.partenaire.emailContact}`;
    }
  }

  /**
   * Navigation vers les formations
   */
  voirFormations() {
    this.router.navigate(['/formations']);
  }

  /**
   * Navigation vers les contacts
   */
  voirContacts() {
    this.router.navigate(['/contacts']);
  }

  /**
   * Obtient la configuration de la région
   */
  getRegionConfig() {
    if (!this.partenaire?.region) return null;
    return this.regionConfig[this.partenaire.region];
  }

  /**
   * Obtient la couleur pour un tag de domaine
   */
  getDomaineTagSeverity(index: number): string {
    const severities = ['success', 'info', 'warning', 'danger', 'secondary'];
    return severities[index % severities.length];
  }

  /**
   * Vérifie si le partenaire a des informations de contact
   */
  hasContactInfo(): boolean {
    return !!(this.partenaire?.emailContact || this.partenaire?.siteWeb);
  }

  /**
   * Formate la durée du partenariat
   */
  formatDureePartenariat(): string {
    return this.partenaire?.dureePartenariat || 'Non spécifiée';
  }

  /**
   * Obtient le statut d'activité
   */
  getStatutActivite(): { label: string; severity: string; icon: string } {
    if (this.partenaire?.actif) {
      return {
        label: 'Partenariat actif',
        severity: 'success',
        icon: 'pi pi-check-circle'
      };
    } else {
      return {
        label: 'Partenariat inactif',
        severity: 'danger',
        icon: 'pi pi-times-circle'
      };
    }
  }

  /**
   * Recharge les données
   */
  recharger() {
    if (this.partenaireId) {
      this.chargerPartenaire(this.partenaireId);
    }
  }

  /**
   * Navigation vers un autre partenaire dans la même région
   */
  voirAutresPartenaires() {
    if (this.partenaire?.region) {
      this.router.navigate(['/universites/ecoles-partenaires'], {
        queryParams: { region: this.partenaire.region }
      });
    }
  }

  /**
   * Partage les informations du partenaire
   */
  partager() {
    if (navigator.share && this.partenaire) {
      navigator.share({
        title: `École partenaire: ${this.partenaire.nom}`,
        text: `Découvrez notre partenariat avec ${this.partenaire.nom} - ${this.partenaire.pays}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: copier l'URL
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Lien copié',
          detail: 'Le lien a été copié dans le presse-papiers'
        });
      }).catch(() => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Partage non disponible',
          detail: 'Impossible de partager ou copier le lien'
        });
      });
    }
  }
}