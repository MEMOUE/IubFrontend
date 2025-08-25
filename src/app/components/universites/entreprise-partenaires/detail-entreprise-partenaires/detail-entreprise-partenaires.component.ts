import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';

// Services and models
import { PartenaireService } from '../../../../core/services/partenaire.service';
import { AuthService } from '../../../../core/services/auth.service'; // ✅ AJOUT
import { EntreprisePartenaire } from '../../../../shared/models/partenaire.model';

@Component({
  selector: 'app-detail-entreprise-partenaires',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    CardModule,
    ChipModule,
    DividerModule
  ],
  providers: [MessageService],
  templateUrl: './detail-entreprise-partenaires.component.html',
  styleUrl: './detail-entreprise-partenaires.component.css'
})
export class DetailEntreprisePartenairesComponent implements OnInit {

  entreprise: EntreprisePartenaire | null = null;
  loading = false;
  entrepriseId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partenaireService: PartenaireService,
    private messageService: MessageService,
    private authService: AuthService // ✅ AJOUT
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.entrepriseId = +params['id'];
      if (this.entrepriseId) {
        this.chargerEntreprise();
      }
    });
  }

  // ✅ NOUVELLES MÉTHODES : Vérification d'authentification
  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isUserAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  }

  canAdministrate(): boolean {
    return this.isUserLoggedIn() && this.isUserAdmin();
  }

  // Charger les détails de l'entreprise
  chargerEntreprise() {
    if (!this.entrepriseId) return;

    this.loading = true;
    this.partenaireService.getEntreprisePartenaireById(this.entrepriseId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (entreprise) => {
          this.entreprise = entreprise;
        },
        error: (error) => {
          console.error('Erreur lors du chargement de l\'entreprise:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les détails de l\'entreprise'
          });
          this.retourListe();
        }
      });
  }

  // Retour à la liste
  retourListe() {
    this.router.navigate(['/universite/entreprises-partenaires']);
  }

  // Modifier l'entreprise
  modifierEntreprise() {
    // ✅ VÉRIFICATION SUPPLÉMENTAIRE (optionnelle, car le bouton est déjà conditionné)
    if (!this.canAdministrate()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Accès refusé',
        detail: 'Vous devez être connecté en tant qu\'administrateur pour effectuer cette action.'
      });
      return;
    }

    if (this.entreprise?.id) {
      this.router.navigate(['/universite/entreprises-partenaires/modifier', this.entreprise.id]);
    }
  }

  // Supprimer l'entreprise
  supprimerEntreprise() {
    // ✅ VÉRIFICATION SUPPLÉMENTAIRE (optionnelle, car le bouton est déjà conditionné)
    if (!this.canAdministrate()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Accès refusé',
        detail: 'Vous devez être connecté en tant qu\'administrateur pour effectuer cette action.'
      });
      return;
    }

    if (!this.entreprise?.id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette entreprise partenaire ?')) {
      this.partenaireService.deleteEntreprisePartenaire(this.entreprise.id)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Entreprise supprimée avec succès'
            });
            this.retourListe();
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible de supprimer l\'entreprise'
            });
          }
        });
    }
  }

  // Naviguer vers le site web de l'entreprise
  visiterSiteWeb() {
    if (this.entreprise?.siteWeb) {
      window.open(this.entreprise.siteWeb, '_blank');
    }
  }

  // Envoyer un email
  envoyerEmail() {
    if (this.entreprise?.emailContact) {
      window.location.href = `mailto:${this.entreprise.emailContact}`;
    }
  }

  // Méthodes utilitaires
  getSecteurIcon(secteur: string): string {
    switch (secteur?.toLowerCase()) {
      case 'télécommunications':
        return 'pi pi-mobile';
      case 'banque et finance':
        return 'pi pi-credit-card';
      case 'technologies':
        return 'pi pi-desktop';
      case 'industrie agroalimentaire':
        return 'pi pi-cog';
      default:
        return 'pi pi-building';
    }
  }

  getTailleColor(taille: string): string {
    switch (taille?.toLowerCase()) {
      case 'grande entreprise':
        return '#B85450';
      case 'pme':
        return '#5A7C59';
      default:
        return '#6B6B6B';
    }
  }

  formatDureePartenariat(duree: string): string {
    if (!duree) return 'Non spécifié';
    return duree;
  }
}
