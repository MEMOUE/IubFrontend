import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeFaces imports
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    ButtonModule,
    CardModule,
    DividerModule,
    TagModule,
    TimelineModule,
    PanelModule
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit, OnDestroy {
  
  // Carousel data
  carouselImages = [
    {
      image: 'Accueil1.jpg',
      title: 'Excellence Académique',
      subtitle: 'Formation de qualité internationale',
      description: 'Découvrez nos programmes d\'enseignement supérieur reconnus pour leur excellence et leur innovation.'
    },
    {
      image: 'Accueil2.jpg',
      title: 'Innovation & Recherche',
      subtitle: 'À la pointe de la technologie',
      description: 'Un environnement d\'apprentissage moderne qui prépare nos étudiants aux défis de demain.'
    },
    {
      image: 'Accueil3.jpg',
      title: 'Ouverture Internationale',
      subtitle: 'Une université sans frontières',
      description: 'Profitez de nos partenariats internationaux et de nos opportunités d\'échanges académiques.'
    }
  ];

  // Services data
  services = [
    {
      icon: 'pi-graduation-cap',
      title: 'Formations Diversifiées',
      description: 'Plus de 20 programmes d\'études dans différents domaines'
    },
    {
      icon: 'pi-users',
      title: 'Encadrement Personnalisé',
      description: 'Un suivi individualisé pour chaque étudiant'
    },
    {
      icon: 'pi-globe',
      title: 'Partenariats Internationaux',
      description: 'Collaborations avec des universités du monde entier'
    },
    {
      icon: 'pi-briefcase',
      title: 'Insertion Professionnelle',
      description: 'Accompagnement vers l\'emploi et stages en entreprise'
    }
  ];

  // Statistics
  statistics = [
    { number: '2000+', label: 'Étudiants' },
    { number: '15+', label: 'Formations' },
    { number: '50+', label: 'Enseignants' },
    { number: '95%', label: 'Taux de réussite' }
  ];

  // News/Events
  actualites = [
    {
      date: '15 Déc 2024',
      title: 'Cérémonie de Remise des Diplômes',
      description: 'Félicitations à nos 300 nouveaux diplômés de la promotion 2024.',
      image: 'Accueil1.jpg'
    },
    {
      date: '10 Déc 2024',
      title: 'Nouveau Partenariat International',
      description: 'Signature d\'un accord avec l\'Université de Paris pour les échanges étudiants.',
      image: 'Accueil2.jpg'
    },
    {
      date: '5 Déc 2024',
      title: 'Salon de l\'Orientation 2024',
      description: 'Découvrez nos formations lors du salon de l\'orientation.',
      image: 'Accueil3.jpg'
    }
  ];

  // Timeline events
  timelineEvents = [
    {
      date: '2010',
      title: 'Création de l\'IUB',
      description: 'Fondation de l\'International University of Bouake'
    },
    {
      date: '2015',
      title: 'Premier Partenariat',
      description: 'Signature du premier accord international'
    },
    {
      date: '2020',
      title: 'Campus Moderne',
      description: 'Inauguration du nouveau campus technologique'
    },
    {
      date: '2024',
      title: 'Excellence Reconnue',
      description: 'Certification qualité internationale obtenue'
    }
  ];

  // Carousel responsiveness
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Animation triggers on page load
    this.animateElements();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  animateElements() {
    // Add animation classes after component loads
    setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('animated');
        }, index * 200);
      });
    }, 100);
  }

  navigateToFormations() {
    this.router.navigate(['/formations']);
  }

  navigateToContact() {
    this.router.navigate(['/contacts']);
  }

  navigateToPresentation() {
    this.router.navigate(['/universite/presentation']);
  }

  navigateToActualites() {
    this.router.navigate(['/actualites']);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}