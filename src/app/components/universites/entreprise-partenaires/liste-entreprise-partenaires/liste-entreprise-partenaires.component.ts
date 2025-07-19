import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-liste-entreprise-partenaires',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './liste-entreprise-partenaires.component.html',
  styleUrl: './liste-entreprise-partenaires.component.css'
})
export class ListeEntreprisePartenairesComponent implements OnInit {

  // Entreprises partenaires par secteur
  entreprises = {
    telecoms: [
      {
        id: 1,
        nom: 'Orange Côte d\'Ivoire',
        secteur: 'Télécommunications',
        taille: 'Grande entreprise',
        localisation: 'Abidjan',
        typePartenariat: 'Partenariat stratégique',
        collaborations: ['Stages', 'Emplois', 'Projets étudiants', 'Formations'],
        dureePartenariat: 'Depuis 2015',
        description: 'Leader des télécommunications en Côte d\'Ivoire, Orange CI offre de nombreuses opportunités à nos étudiants en informatique et management.',
        avantages: ['Stages rémunérés', 'Contrats d\'apprentissage', 'Recrutement prioritaire', 'Formations techniques'],
        postes: ['Ingénieur réseau', 'Chef de projet IT', 'Responsable marketing', 'Analyste données']
      },
      {
        id: 2,
        nom: 'MTN Côte d\'Ivoire',
        secteur: 'Télécommunications',
        taille: 'Grande entreprise',
        localisation: 'Abidjan',
        typePartenariat: 'Partenariat académique',
        collaborations: ['Stages', 'Emplois', 'Conférences', 'Projets'],
        dureePartenariat: 'Depuis 2018',
        description: 'Opérateur majeur en télécommunications, MTN CI propose des opportunités dans les technologies mobiles et le digital.',
        avantages: ['Programmes de stage', 'Emplois directs', 'Formations certifiantes', 'Projets innovants'],
        postes: ['Développeur mobile', 'Ingénieur télécoms', 'Responsable commercial', 'Spécialiste cybersécurité']
      }
    ],
    banque: [
      {
        id: 3,
        nom: 'BICICI',
        secteur: 'Banque et Finance',
        taille: 'Grande entreprise',
        localisation: 'Abidjan',
        typePartenariat: 'Partenariat formation',
        collaborations: ['Stages', 'Emplois', 'Formations spécialisées', 'Projets'],
        dureePartenariat: 'Depuis 2016',
        description: 'Banque de référence proposant des opportunités en finance, comptabilité et management bancaire.',
        avantages: ['Stages en agences', 'Formation aux métiers bancaires', 'Recrutement diplômés', 'Évolution de carrière'],
        postes: ['Conseiller clientèle', 'Analyste financier', 'Chargé d\'affaires', 'Auditeur interne']
      },
      {
        id: 4,
        nom: 'Société Générale CI',
        secteur: 'Banque et Finance',
        taille: 'Grande entreprise',
        localisation: 'Abidjan',
        typePartenariat: 'Partenariat emploi',
        collaborations: ['Stages', 'Emplois', 'Formations', 'Mentoring'],
        dureePartenariat: 'Depuis 2017',
        description: 'Groupe bancaire international offrant des perspectives d\'évolution en finance et banque d\'affaires.',
        avantages: ['Programme de graduate', 'Mobilité internationale', 'Formations qualifiantes', 'Accompagnement carrière'],
        postes: ['Risk manager', 'Trader', 'Analyste crédit', 'Responsable conformité']
      }
    ],
    technologie: [
      {
        id: 5,
        nom: 'Afriland Digital',
        secteur: 'Technologies',
        taille: 'PME',
        localisation: 'Abidjan',
        typePartenariat: 'Partenariat innovation',
        collaborations: ['Stages', 'Projets étudiants', 'Hackathons', 'Formations'],
        dureePartenariat: 'Depuis 2020',
        description: 'Entreprise spécialisée en solutions digitales et développement d\'applications mobiles.',
        avantages: ['Projets réels', 'Mentoring technique', 'Certifications', 'Emplois juniors'],
        postes: ['Développeur web', 'Designer UX/UI', 'Chef de projet digital', 'Data analyst']
      },
      {
        id: 6,
        nom: 'Tech Solutions CI',
        secteur: 'Technologies',
        taille: 'PME',
        localisation: 'Bouaké',
        typePartenariat: 'Partenariat local',
        collaborations: ['Stages', 'Projets', 'Emplois', 'Formations'],
        dureePartenariat: 'Depuis 2019',
        description: 'Société de services informatiques proposant des solutions sur mesure aux entreprises locales.',
        avantages: ['Proximité géographique', 'Projets variés', 'Environnement startup', 'Évolution rapide'],
        postes: ['Développeur logiciel', 'Administrateur système', 'Consultant IT', 'Support technique']
      }
    ],
    industrie: [
      {
        id: 7,
        nom: 'SIFCA Groupe',
        secteur: 'Industrie Agroalimentaire',
        taille: 'Grande entreprise',
        localisation: 'Abidjan',
        typePartenariat: 'Partenariat secteur',
        collaborations: ['Stages', 'Emplois', 'Recherche', 'Projets'],
        dureePartenariat: 'Depuis 2016',
        description: 'Leader de l\'agro-industrie en Afrique de l\'Ouest avec des opportunités en management et ingénierie.',
        avantages: ['Stages terrain', 'Formation industrielle', 'Emplois techniques', 'Management opérationnel'],
        postes: ['Ingénieur production', 'Responsable qualité', 'Manager d\'usine', 'Logisticien']
      },
      {
        id: 8,
        nom: 'Nestlé Côte d\'Ivoire',
        secteur: 'Industrie Agroalimentaire',
        taille: 'Grande entreprise',
        localisation: 'Abidjan',
        typePartenariat: 'Partenariat multinational',
        collaborations: ['Stages', 'Graduate program', 'Formations', 'Projets'],
        dureePartenariat: 'Depuis 2018',
        description: 'Multinationale agroalimentaire offrant des opportunités de carrière internationale.',
        avantages: ['Standards internationaux', 'Mobilité mondiale', 'Formations Nestlé', 'Évolution accélérée'],
        postes: ['Chef de produit', 'Supply chain manager', 'Responsable marketing', 'Contrôleur de gestion']
      }
    ]
  };

  // Statistiques des partenariats entreprises
  statistiques = [
    { valeur: '50+', label: 'Entreprises partenaires' },
    { valeur: '300+', label: 'Stages par an' },
    { valeur: '85%', label: 'Taux d\'emploi' },
    { valeur: '1200+', label: 'Diplômés en poste' }
  ];

  // Filtre actuel
  secteurActif = 'telecoms';

  constructor(private router: Router) {}

  ngOnInit() {}

  // Changer de secteur
  changerSecteur(secteur: string) {
    this.secteurActif = secteur;
  }

  // Obtenir les entreprises du secteur actif
  getEntreprisesActives() {
    return this.entreprises[this.secteurActif as keyof typeof this.entreprises] || [];
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
}