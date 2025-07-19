import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-listeformation',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './listeformation.component.html',
  styleUrl: './listeformation.component.css'
})
export class ListeformationComponent implements OnInit {

  // Formations par catégorie
  formations = {
    licence: [
      {
        id: 1,
        nom: 'Licence en Management',
        duree: '3 ans',
        diplome: 'Licence (Bac+3)',
        description: 'Formation complète en gestion d\'entreprise, marketing et management des équipes.',
        objectifs: ['Gestion d\'entreprise', 'Marketing digital', 'Management d\'équipe', 'Entrepreneuriat'],
        debouches: ['Chef d\'entreprise', 'Responsable commercial', 'Chargé de marketing', 'Manager'],
        frais: '500 000 FCFA/an'
      },
      {
        id: 2,
        nom: 'Licence en Informatique',
        duree: '3 ans',
        diplome: 'Licence (Bac+3)',
        description: 'Formation en développement logiciel, réseaux informatiques et systèmes d\'information.',
        objectifs: ['Programmation', 'Base de données', 'Réseaux', 'Développement web'],
        debouches: ['Développeur', 'Administrateur réseau', 'Analyste programmeur', 'Chef de projet IT'],
        frais: '550 000 FCFA/an'
      },
      {
        id: 3,
        nom: 'Licence en Comptabilité-Finance',
        duree: '3 ans',
        diplome: 'Licence (Bac+3)',
        description: 'Formation en comptabilité générale, finance d\'entreprise et audit.',
        objectifs: ['Comptabilité générale', 'Finance d\'entreprise', 'Audit', 'Fiscalité'],
        debouches: ['Comptable', 'Auditeur', 'Contrôleur de gestion', 'Analyste financier'],
        frais: '450 000 FCFA/an'
      },
      {
        id: 4,
        nom: 'Licence en Communication',
        duree: '3 ans',
        diplome: 'Licence (Bac+3)',
        description: 'Formation en communication digitale, relations publiques et journalisme.',
        objectifs: ['Communication digitale', 'Relations publiques', 'Journalisme', 'Marketing'],
        debouches: ['Chargé de communication', 'Journaliste', 'Community manager', 'Attaché de presse'],
        frais: '450 000 FCFA/an'
      }
    ],
    master: [
      {
        id: 5,
        nom: 'Master en Management Stratégique',
        duree: '2 ans',
        diplome: 'Master (Bac+5)',
        description: 'Formation avancée en stratégie d\'entreprise et leadership.',
        objectifs: ['Stratégie d\'entreprise', 'Leadership', 'Innovation', 'Management international'],
        debouches: ['Directeur général', 'Consultant', 'Manager senior', 'Entrepreneur'],
        frais: '750 000 FCFA/an'
      },
      {
        id: 6,
        nom: 'Master en Ingénierie Informatique',
        duree: '2 ans',
        diplome: 'Master (Bac+5)',
        description: 'Formation spécialisée en intelligence artificielle et big data.',
        objectifs: ['Intelligence artificielle', 'Big Data', 'Cybersécurité', 'Cloud computing'],
        debouches: ['Ingénieur logiciel', 'Data scientist', 'Expert cybersécurité', 'Architecte IT'],
        frais: '800 000 FCFA/an'
      },
      {
        id: 7,
        nom: 'Master en Finance d\'Entreprise',
        duree: '2 ans',
        diplome: 'Master (Bac+5)',
        description: 'Formation en finance avancée et gestion des risques.',
        objectifs: ['Finance d\'entreprise', 'Gestion des risques', 'Marchés financiers', 'Investment banking'],
        debouches: ['Directeur financier', 'Analyste financier', 'Gestionnaire de portefeuille', 'Consultant financier'],
        frais: '700 000 FCFA/an'
      },
      {
        id: 8,
        nom: 'Master en Marketing Digital',
        duree: '2 ans',
        diplome: 'Master (Bac+5)',
        description: 'Formation spécialisée en marketing numérique et e-commerce.',
        objectifs: ['Marketing digital', 'E-commerce', 'Analytics', 'Social media'],
        debouches: ['Directeur marketing', 'Responsable e-commerce', 'Consultant digital', 'Growth hacker'],
        frais: '650 000 FCFA/an'
      }
    ]
  };

  // Statistiques des formations
  statistiques = [
    { valeur: '15+', label: 'Formations disponibles' },
    { valeur: '95%', label: 'Taux d\'insertion professionnelle' },
    { valeur: '50+', label: 'Enseignants qualifiés' },
    { valeur: '2000+', label: 'Étudiants formés' }
  ];

  // Filtre actuel
  categorieActive = 'licence';

  constructor(private router: Router) {}

  ngOnInit() {}

  // Changer de catégorie
  changerCategorie(categorie: string) {
    this.categorieActive = categorie;
  }

  // Obtenir les formations de la catégorie active
  getFormationsActives() {
    return this.formations[this.categorieActive as keyof typeof this.formations] || [];
  }

  // Navigation vers les détails d'une formation
  voirDetails(formationId: number) {
    this.router.navigate(['/formations/details', formationId]);
  }

  // Navigation vers contact
  navigateToContact() {
    this.router.navigate(['/contacts']);
  }

  // Navigation vers présentation
  navigateToPresentation() {
    this.router.navigate(['/universite/presentation']);
  }
}