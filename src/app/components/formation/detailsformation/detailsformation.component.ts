import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

// Services et modèles
import { FormationService } from '../../../core/services/formation.service';
import { Formation } from '../../../shared/models/formation.model';

@Component({
  selector: 'app-detailsformation',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    PanelModule,
    TagModule,
    ProgressBarModule,
    ToastModule,
    SkeletonModule,
    DividerModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './detailsformation.component.html',
  styleUrl: './detailsformation.component.css'
})
export class DetailsformationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  formation: Formation | null = null;
  loading = true;
  error: string | null = null;
  formationId: number | null = null;

  // États des actions
  inscriptionLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formationService: FormationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // Récupérer l'ID de la formation depuis les paramètres de route
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.formationId = +id;
        this.loadFormation();
      } else {
        this.error = 'ID de formation invalide';
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Charger les détails de la formation
  loadFormation() {
    if (!this.formationId) return;

    this.loading = true;
    this.error = null;

    this.formationService.getFormationById(this.formationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (formation) => {
          this.formation = formation;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement de la formation:', error);
          this.error = 'Formation non trouvée ou erreur de chargement';
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les détails de la formation',
            life: 5000
          });
        }
      });
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
  getOccupancyPercentage(): number {
    if (!this.formation || !this.formation.nombrePlaces || this.formation.nombrePlaces === 0) {
      return 0;
    }
    return Math.round((this.formation.nombreInscrits || 0) / this.formation.nombrePlaces * 100);
  }

  // Vérifier si la formation est presque complète
  isNearlyFull(): boolean {
    return this.getOccupancyPercentage() >= 80;
  }

  // Vérifier si la formation est complète
  isFull(): boolean {
    if (!this.formation) return false;
    return (this.formation.nombreInscrits || 0) >= (this.formation.nombrePlaces || 0);
  }

  // Obtenir la couleur du tag de statut
  getStatusSeverity(): string {
    if (!this.formation) return 'info';
    
    if (!this.formation.disponible || !this.formation.actif) {
      return 'danger';
    }
    
    if (this.isFull()) {
      return 'warning';
    }
    
    return 'success';
  }

  // Obtenir le texte du statut
  getStatusText(): string {
    if (!this.formation) return 'Chargement...';
    
    if (!this.formation.actif) {
      return 'Formation inactive';
    }
    
    if (!this.formation.disponible) {
      return 'Inscriptions fermées';
    }
    
    if (this.isFull()) {
      return 'Formation complète';
    }
    
    return 'Inscriptions ouvertes';
  }

  // S'inscrire à la formation
  inscrireFormation() {
    if (!this.formation || !this.formationId) return;

    if (this.isFull()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formation complète',
        detail: 'Cette formation n\'a plus de places disponibles',
        life: 3000
      });
      return;
    }

    if (!this.formation.disponible || !this.formation.actif) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Inscription impossible',
        detail: 'Les inscriptions ne sont pas ouvertes pour cette formation',
        life: 3000
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir vous inscrire à la formation "${this.formation.nom}" ?`,
      header: 'Confirmation d\'inscription',
      icon: 'pi pi-question-circle',
      accept: () => {
        this.proceedWithInscription();
      }
    });
  }

  // Procéder à l'inscription
  private proceedWithInscription() {
    if (!this.formationId) return;

    this.inscriptionLoading = true;

    this.formationService.inscrireEtudiant(this.formationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedFormation) => {
          this.formation = updatedFormation;
          this.inscriptionLoading = false;
          
          this.messageService.add({
            severity: 'success',
            summary: 'Inscription réussie',
            detail: `Vous êtes inscrit(e) à la formation "${this.formation.nom}"`,
            life: 5000
          });
        },
        error: (error) => {
          console.error('Erreur lors de l\'inscription:', error);
          this.inscriptionLoading = false;
          
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur d\'inscription',
            detail: 'Impossible de procéder à l\'inscription. Veuillez réessayer.',
            life: 3000
          });
        }
      });
  }

  // Retourner à la liste des formations
  goBack() {
    this.router.navigate(['/formations']);
  }

  // Partager la formation (placeholder)
  shareFormation() {
    // Implémenter la logique de partage
    if (navigator.share) {
      navigator.share({
        title: this.formation?.nom || 'Formation IUB',
        text: this.formation?.description || 'Découvrez cette formation à l\'IUB',
        url: window.location.href
      }).catch(() => {
        this.copyToClipboard();
      });
    } else {
      this.copyToClipboard();
    }
  }

  // Copier le lien dans le presse-papiers
  private copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.messageService.add({
        severity: 'info',
        summary: 'Lien copié',
        detail: 'Le lien de la formation a été copié dans le presse-papiers',
        life: 3000
      });
    }).catch(() => {
      this.messageService.add({
        severity: 'warn',
        summary: 'Erreur',
        detail: 'Impossible de copier le lien',
        life: 3000
      });
    });
  }

  // Télécharger la brochure (placeholder)
  downloadBrochure() {
    this.messageService.add({
      severity: 'info',
      summary: 'Téléchargement',
      detail: 'Fonctionnalité de téléchargement de brochure à implémenter',
      life: 3000
    });
  }

  // Navigation vers contact
  navigateToContact() {
    this.router.navigate(['/contacts']);
  }

  // Obtenir les places restantes
  getPlacesRestantes(): number {
    if (!this.formation) return 0;
    return (this.formation.nombrePlaces || 0) - (this.formation.nombreInscrits || 0);
  }

  // Obtenir le label de la catégorie
  getCategorieLabel(categorie: string): string {
    const labels: { [key: string]: string } = {
      'bts_dut': 'BTS/DUT (Bac+2)',
      'licence': 'Licence (Bac+3)',
      'licence_pro': 'Licence Professionnelle (Bac+3)',
      'master': 'Master (Bac+5)',
      'master_pro': 'Master Professionnel (Bac+5)',
      'mba': 'MBA',
      'doctorat': 'Doctorat (Bac+8)',
      'formation_continue': 'Formation Continue',
      'certification': 'Certification Professionnelle'
    };
    return labels[categorie] || categorie;
  }
}