import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-listepartenaires',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './listepartenaires.component.html',
  styleUrl: './listepartenaires.component.css'
})
export class ListepartenairesComponent implements OnInit {

  // Écoles partenaires par région
  partenaires = {
    europe: [
      {
        id: 1,
        nom: 'Université Paris-Dauphine',
        pays: 'France',
        ville: 'Paris',
        type: 'Université publique',
        domaines: ['Management', 'Finance', 'Mathématiques'],
        programmes: ['Échanges étudiants', 'Double diplôme', 'Stages'],
        dureePartenariat: 'Depuis 2018',
        description: 'Partenariat stratégique pour les programmes de management et finance avec possibilité de double diplôme.',
        avantages: ['Double diplôme Master', 'Échanges semestriels', 'Stages en entreprises françaises']
      },
      {
        id: 2,
        nom: 'ESCP Business School',
        pays: 'France',
        ville: 'Paris',
        type: 'École de commerce',
        domaines: ['Business', 'Management', 'Entrepreneuriat'],
        programmes: ['Échanges étudiants', 'Summer School', 'Formations courtes'],
        dureePartenariat: 'Depuis 2020',
        description: 'Collaboration pour l\'excellence en management et entrepreneuriat avec accès aux programmes européens.',
        avantages: ['Summer School', 'Échanges courts', 'Certifications européennes']
      },
      {
        id: 3,
        nom: 'Université de Liège',
        pays: 'Belgique',
        ville: 'Liège',
        type: 'Université publique',
        domaines: ['Ingénierie', 'Sciences', 'Management'],
        programmes: ['Échanges étudiants', 'Recherche collaborative', 'Double diplôme'],
        dureePartenariat: 'Depuis 2019',
        description: 'Partenariat académique fort en ingénierie et sciences avec programmes de recherche conjoints.',
        avantages: ['Échanges Erasmus+', 'Projets de recherche', 'Double diplôme ingénieur']
      }
    ],
    amerique: [
      {
        id: 4,
        nom: 'Université de Montréal',
        pays: 'Canada',
        ville: 'Montréal',
        type: 'Université publique',
        domaines: ['Technologies', 'Sciences', 'Management'],
        programmes: ['Échanges étudiants', 'Stages', 'Programmes courts'],
        dureePartenariat: 'Depuis 2021',
        description: 'Collaboration pour l\'innovation technologique et les sciences appliquées avec le Québec.',
        avantages: ['Échanges francophones', 'Stages technologiques', 'Immersion culturelle']
      },
      {
        id: 5,
        nom: 'Florida International University',
        pays: 'États-Unis',
        ville: 'Miami',
        type: 'Université publique',
        domaines: ['Business', 'Informatique', 'Communication'],
        programmes: ['Summer Programs', 'Échanges courts', 'Certifications'],
        dureePartenariat: 'Depuis 2022',
        description: 'Partenariat stratégique pour l\'ouverture sur le marché américain et les certifications internationales.',
        avantages: ['Programmes d\'été', 'Certifications US', 'Réseau professionnel américain']
      }
    ],
    afrique: [
      {
        id: 6,
        nom: 'Université Cheikh Anta Diop',
        pays: 'Sénégal',
        ville: 'Dakar',
        type: 'Université publique',
        domaines: ['Droit', 'Économie', 'Sciences sociales'],
        programmes: ['Échanges étudiants', 'Recherche collaborative', 'Formations conjointes'],
        dureePartenariat: 'Depuis 2017',
        description: 'Coopération académique régionale pour le développement de l\'enseignement supérieur en Afrique de l\'Ouest.',
        avantages: ['Échanges régionaux', 'Recherche africaine', 'Formations spécialisées']
      },
      {
        id: 7,
        nom: 'Université du Ghana',
        pays: 'Ghana',
        ville: 'Accra',
        type: 'Université publique',
        domaines: ['Business', 'Technologies', 'Agriculture'],
        programmes: ['Échanges étudiants', 'Projets communs', 'Formations'],
        dureePartenariat: 'Depuis 2020',
        description: 'Partenariat pour le développement économique régional et l\'innovation technologique.',
        avantages: ['Coopération sous-régionale', 'Projets innovants', 'Échanges culturels']
      }
    ]
  };

  // Statistiques des partenariats
  statistiques = [
    { valeur: '15+', label: 'Écoles partenaires' },
    { valeur: '8', label: 'Pays représentés' },
    { valeur: '500+', label: 'Étudiants en échange' },
    { valeur: '50+', label: 'Programmes disponibles' }
  ];

  // Filtre actuel
  regionActive = 'europe';

  constructor(private router: Router) {}

  ngOnInit() {}

  // Changer de région
  changerRegion(region: string) {
    this.regionActive = region;
  }

  // Obtenir les partenaires de la région active
  getPartenairesActifs() {
    return this.partenaires[this.regionActive as keyof typeof this.partenaires] || [];
  }

  // Navigation vers les détails d'un partenaire
  voirDetails(partenaireId: number) {
    this.router.navigate(['/universite/ecoles-partenaires/details', partenaireId]);
  }

  // Navigation vers contact
  navigateToContact() {
    this.router.navigate(['/contacts']);
  }

  // Navigation vers formations
  navigateToFormations() {
    this.router.navigate(['/formations']);
  }
}