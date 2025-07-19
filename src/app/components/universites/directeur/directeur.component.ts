import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-directeur',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './directeur.component.html',
  styleUrl: './directeur.component.css'
})
export class DirecteurComponent implements OnInit {

  // Informations du directeur
  directeur = {
    nom: 'Dr. Jean-Baptiste KOUAME',
    titre: 'Directeur Général de l\'IUB',
    photo: 'directeur.jpg',
    experience: '20 ans d\'expérience dans l\'enseignement supérieur',
    diplomes: [
      'Doctorat en Sciences de l\'Éducation',
      'Master en Management Éducatif',
      'Certification en Leadership Académique'
    ]
  };

  // Sections du message
  messageSections = [
    {
      titre: 'Bienvenue à l\'IUB',
      contenu: `Chers étudiants, chers parents, chers partenaires,

C'est avec un immense plaisir que je vous accueille à l'International University of Bouake. Depuis notre création en 2010, nous nous sommes engagés à offrir une éducation de qualité internationale qui prépare nos étudiants aux défis du monde moderne.`
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

L'équipe de l'IUB et moi-même sommes là pour vous accompagner dans cette belle aventure qu'est la formation universitaire.

Ensemble, construisons l'avenir !`
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  navigateToFormations() {
    this.router.navigate(['/formations']);
  }

  navigateToContact() {
    this.router.navigate(['/contacts']);
  }

  navigateToPresentation() {
    this.router.navigate(['/universite/presentation']);
  }
}