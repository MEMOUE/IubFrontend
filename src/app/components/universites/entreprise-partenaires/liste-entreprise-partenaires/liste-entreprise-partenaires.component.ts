import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Services and models
import { PartenaireService } from '../../../../core/services/partenaire.service';
import { EntreprisePartenaire } from '../../../../shared/models/partenaire.model';

@Component({
  selector: 'app-liste-entreprise-partenaires',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './liste-entreprise-partenaires.component.html',
  styleUrl: './liste-entreprise-partenaires.component.css'
})
export class ListeEntreprisePartenairesComponent implements OnInit {

  // Données
  entreprises: EntreprisePartenaire[] = [];
  entreprisesFiltrees: EntreprisePartenaire[] = [];
  loading = false;

  // Statistiques
  statistiques = [
    { valeur: '0', label: 'Entreprises partenaires' },
    { valeur: '300+', label: 'Stages par an' },
    { valeur: '85%', label: 'Taux d\'emploi' },
    { valeur: '1200+', label: 'Diplômés en poste' }
  ];

  // Secteurs disponibles
  secteurs = [
    { key: 'tous', label: 'Tous les secteurs', icon: 'pi pi-th-large' },
    { key: 'Télécommunications', label: 'Télécommunications', icon: 'pi pi-mobile' },
    { key: 'Banque et Finance', label: 'Banque & Finance', icon: 'pi pi-credit-card' },
    { key: 'Technologies', label: 'Technologies', icon: 'pi pi-desktop' },
    { key: 'Industrie Agroalimentaire', label: 'Industrie', icon: 'pi pi-cog' }
  ];

  // Filtre actuel
  secteurActif = 'tous';

  constructor(
    private router: Router,
    private partenaireService: PartenaireService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.chargerEntreprises();
    this.chargerStatistiques();
  }

  // Charger toutes les entreprises
  chargerEntreprises() {
    this.loading = true;
    this.partenaireService.getEntreprisesPartenaires()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (entreprises) => {
          this.entreprises = entreprises;
          this.entreprisesFiltrees = entreprises;
          this.appliquerFiltreSecteur(this.secteurActif);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des entreprises:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les entreprises partenaires'
          });
        }
      });
  }

  // Charger les statistiques
  chargerStatistiques() {
    // Compter les entreprises
    this.partenaireService.getEntreprisesPartenaires().subscribe({
      next: (entreprises) => {
        this.statistiques[0].valeur = entreprises.length.toString() + '+';
      }
    });
  }

  // Changer de secteur
  changerSecteur(secteur: string) {
    this.secteurActif = secteur;
    this.appliquerFiltreSecteur(secteur);
  }

  // Appliquer le filtre par secteur
  appliquerFiltreSecteur(secteur: string) {
    if (secteur === 'tous') {
      this.entreprisesFiltrees = this.entreprises;
    } else {
      this.entreprisesFiltrees = this.entreprises.filter(e => e.secteur === secteur);
    }
  }

  // Obtenir les entreprises filtrées
  getEntreprisesActives(): EntreprisePartenaire[] {
    return this.entreprisesFiltrees;
  }

  // Navigation vers les détails d'une entreprise
  voirDetails(entrepriseId: number) {
    this.router.navigate(['/universite/entreprises-partenaires/details', entrepriseId]);
  }

  // Navigation vers contact
  navigateToContact() {
    this.router.navigate(['/contacts']);
  }

  // Navigation vers formations
  navigateToFormations() {
    this.router.navigate(['/formations']);
  }

  // Navigation vers création d'entreprise
  ajouterEntreprise() {
    this.router.navigate(['/universite/entreprises-partenaires/nouveau']);
  }

  // Méthodes utilitaires pour l'affichage
  getSecteurIcon(secteur: string): string {
    const secteurConfig = this.secteurs.find(s => s.key === secteur);
    return secteurConfig?.icon || 'pi pi-building';
  }

  getSecteurLabel(secteur: string): string {
    const secteurConfig = this.secteurs.find(s => s.key === secteur);
    return secteurConfig?.label || secteur;
  }

  // Formater la durée du partenariat
  formatDureePartenariat(duree: string): string {
    if (!duree) return 'Non spécifié';
    return duree;
  }

  // Obtenir couleur pour la taille d'entreprise
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
}