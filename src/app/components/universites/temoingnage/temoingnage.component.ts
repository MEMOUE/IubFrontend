import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-temoingnage',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './temoingnage.component.html',
  styleUrl: './temoingnage.component.css'
})
export class TemoingnageComponent implements OnInit {

  // Témoignages d'étudiants et diplômés
  temoignages = [
    {
      nom: 'Aminata TRAORE',
      formation: 'Master en Management',
      promotion: 'Promotion 2023',
      poste: 'Responsable Marketing - Orange CI',
      temoignage: `Mon passage à l'IUB a été déterminant pour ma carrière. Les enseignants sont compétents et à l'écoute. La formation pratique m'a permis de décrocher mon emploi actuel dès la fin de mes études.`,
      note: 5
    },
    {
      nom: 'Kouadio KOFFI',
      formation: 'Licence en Informatique',
      promotion: 'Promotion 2022',
      poste: 'Développeur Full-Stack - Tech Solutions',
      temoignage: `L'IUB m'a donné une base solide en informatique. Les projets pratiques et les stages m'ont préparé au monde professionnel. Je recommande vivement cette université.`,
      note: 5
    },
    {
      nom: 'Marie KOUAME',
      formation: 'Master en Finance',
      promotion: 'Promotion 2023',
      poste: 'Analyste Financière - BICICI',
      temoignage: `La qualité de l'enseignement et l'accompagnement personnalisé font la différence. L'IUB m'a aidée à développer mes compétences et ma confiance en moi.`,
      note: 5
    },
    {
      nom: 'Ibrahim COULIBALY',
      formation: 'Licence en Commerce',
      promotion: 'Promotion 2021',
      poste: 'Entrepreneur - Agribusiness',
      temoignage: `L'esprit entrepreneurial encouragé à l'IUB m'a inspiré à créer ma propre entreprise. Les connaissances acquises me servent quotidiennement dans la gestion de mon business.`,
      note: 4
    },
    {
      nom: 'Fatou DIALLO',
      formation: 'Master en Communication',
      promotion: 'Promotion 2022',
      poste: 'Chargée de Communication - MTN',
      temoignage: `L'IUB offre un environnement d'apprentissage exceptionnel. Les méthodes pédagogiques modernes et les enseignants qualifiés m'ont permis d'exceller dans mon domaine.`,
      note: 5
    },
    {
      nom: 'Yves BROU',
      formation: 'Licence en Comptabilité',
      promotion: 'Promotion 2020',
      poste: 'Comptable Senior - Cabinet KPMG',
      temoignage: `Grâce à la formation rigoureuse de l'IUB, j'ai pu intégrer un cabinet international. L'université prépare vraiment bien ses étudiants au marché du travail.`,
      note: 5
    }
  ];

  // Statistiques de satisfaction
  statistiques = [
    { valeur: '95%', label: 'Taux de satisfaction' },
    { valeur: '90%', label: 'Taux d\'insertion professionnelle' },
    { valeur: '4.8/5', label: 'Note moyenne des diplômés' },
    { valeur: '2000+', label: 'Diplômés depuis 2010' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  navigateToFormations() {
    this.router.navigate(['/formations']);
  }

  navigateToContact() {
    this.router.navigate(['/contacts']);
  }

  // Générer les étoiles pour la notation
  getStars(note: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= note ? 'filled' : 'empty');
    }
    return stars;
  }
}