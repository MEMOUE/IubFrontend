import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

// Services
import { DirecteurService, Directeur } from '../../../core/services/directeur.service';

interface MessageSection {
  titre: string;
  contenu: string;
}

@Component({
  selector: 'app-directeur',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule
  ],
  templateUrl: './directeur.component.html',
  styleUrl: './directeur.component.css'
})
export class DirecteurComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // État du composant
  loading = true;
  error: string | null = null;

  // Données du directeur
  directeur: Directeur | null = null;

  // Sections du message (construites à partir des données du directeur)
  messageSections: MessageSection[] = [];

  // Données par défaut en cas d'absence de directeur
  private readonly defaultDirecteur: Directeur = {
    nom: 'Direction de l\'IUB',
    titre: 'Équipe de Direction',
    photoUrl: 'assets/images/default-director.jpg',
    experience: 'Équipe expérimentée dans l\'enseignement supérieur',
    diplomes: [
      'Expertise en gestion éducative',
      'Leadership académique',
      'Innovation pédagogique'
    ]
  };

  private readonly defaultMessages: MessageSection[] = [
    {
      titre: 'Bienvenue à l\'IUB',
      contenu: `Chers étudiants, chers parents, chers partenaires,

C'est avec un immense plaisir que nous vous accueillons à l'International University of Bouake. Depuis notre création, nous nous sommes engagés à offrir une éducation de qualité internationale qui prépare nos étudiants aux défis du monde moderne.`
    },
    {
      titre: 'Notre Vision',
      contenu: `À l'IUB, nous croyons fermement que l'éducation est le levier principal du développement. Notre mission est de former des leaders compétents, innovants et responsables qui contribueront positivement au développement de la Côte d'Ivoire et de l'Afrique.

Nous offrons un environnement d'apprentissage stimulant où l'excellence académique se combine avec le développement personnel et professionnel.`
    },
    {
      titre: 'Nos Engagements',
      contenu: `Nous nous engageons à maintenir les plus hauts standards de qualité dans nos programmes, à recruter les meilleurs enseignants et à offrir des infrastructures modernes qui favorisent l'apprentissage.

Notre approche pédagogique privilégie l'interaction, la pratique et l'innovation pour préparer nos diplômés aux réalités du marché du travail.`
    },
    {
      titre: 'Message aux Étudiants',
      contenu: `Chers étudiants, vous êtes au cœur de notre mission. Profitez pleinement de votre passage à l'IUB pour développer vos compétences, élargir vos horizons et construire votre avenir.

L'équipe de l'IUB est là pour vous accompagner dans cette belle aventure qu'est la formation universitaire.

Ensemble, construisons l'avenir !`
    }
  ];

  constructor(
    private router: Router,
    private directeurService: DirecteurService
  ) {}

  ngOnInit() {
    this.loadDirecteurData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge les données du directeur depuis l'API
   */
  private loadDirecteurData(): void {
    this.loading = true;
    this.error = null;

    this.directeurService.getCurrentDirecteur()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (directeur) => {
          this.directeur = directeur;
          this.buildMessageSections();
          this.loading = false;
        },
        error: (error) => {
          console.warn('Impossible de charger les données du directeur:', error);
          this.handleDirecteurError();
          this.loading = false;
        }
      });
  }

  /**
   * Gère l'erreur de chargement du directeur
   */
  private handleDirecteurError(): void {
    // Utiliser les données par défaut en cas d'erreur
    this.directeur = this.defaultDirecteur;
    this.messageSections = this.defaultMessages;
    this.error = null; // Ne pas afficher d'erreur à l'utilisateur, utiliser les données par défaut
  }

  /**
   * Construit les sections de message à partir des données du directeur
   */
  private buildMessageSections(): void {
    if (!this.directeur) {
      this.messageSections = this.defaultMessages;
      return;
    }

    this.messageSections = [];

    // Ajouter les messages personnalisés du directeur s'ils existent
    if (this.directeur.messageBienvenue) {
      this.messageSections.push({
        titre: 'Bienvenue à l\'IUB',
        contenu: this.directeur.messageBienvenue
      });
    }

    if (this.directeur.messageVision) {
      this.messageSections.push({
        titre: 'Notre Vision',
        contenu: this.directeur.messageVision
      });
    }

    if (this.directeur.messageEngagements) {
      this.messageSections.push({
        titre: 'Nos Engagements',
        contenu: this.directeur.messageEngagements
      });
    }

    if (this.directeur.messageEtudiants) {
      this.messageSections.push({
        titre: 'Message aux Étudiants',
        contenu: this.directeur.messageEtudiants
      });
    }

    // Si aucun message personnalisé, utiliser les messages par défaut
    if (this.messageSections.length === 0) {
      this.messageSections = this.defaultMessages;
    }
  }

  /**
   * Obtient l'URL de la photo du directeur
   */
  getDirecteurPhotoUrl(): string {
    if (this.directeur?.photoUrl) {
      // Si l'URL commence par http, l'utiliser telle quelle
      if (this.directeur.photoUrl.startsWith('http')) {
        return this.directeur.photoUrl;
      }
      // Sinon, construire l'URL complète
      return `${window.location.origin}/${this.directeur.photoUrl}`;
    }
    
    // Image par défaut
    return 'assets/images/default-director.jpg';
  }

  /**
   * Obtient le nom du directeur ou un nom par défaut
   */
  getDirecteurNom(): string {
    return this.directeur?.nom || this.defaultDirecteur.nom;
  }

  /**
   * Obtient le titre du directeur ou un titre par défaut
   */
  getDirecteurTitre(): string {
    return this.directeur?.titre || this.defaultDirecteur.titre;
  }

  /**
   * Obtient l'expérience du directeur ou une expérience par défaut
   */
  getDirecteurExperience(): string {
    return this.directeur?.experience || this.defaultDirecteur.experience || '';
  }

  /**
   * Obtient les diplômes du directeur ou des diplômes par défaut
   */
  getDirecteurDiplomes(): string[] {
    return this.directeur?.diplomes || this.defaultDirecteur.diplomes || [];
  }

  /**
   * Recharge les données du directeur
   */
  refreshData(): void {
    this.loadDirecteurData();
  }

  // Méthodes de navigation
  navigateToFormations(): void {
    this.router.navigate(['/formations']);
  }

  navigateToContact(): void {
    this.router.navigate(['/contacts']);
  }

  navigateToPresentation(): void {
    this.router.navigate(['/universite/presentation']);
  }
}