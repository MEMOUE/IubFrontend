import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';

interface SocialLink {
  name: string;
  icon: string;
  url: string;
  color: string;
}

interface QuickLink {
  label: string;
  route: string;
}

interface ContactInfo {
  icon: string;
  label: string;
  value: string;
  link?: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DividerModule,
    TooltipModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {

  currentYear = new Date().getFullYear();

  socialLinks: SocialLink[] = [
    {
      name: 'Facebook',
      icon: 'pi pi-facebook',
      url: 'https://facebook.com/iub-bouake',
      color: '#1877F2'
    },
    {
      name: 'LinkedIn',
      icon: 'pi pi-linkedin',
      url: 'https://linkedin.com/school/iub-bouake',
      color: '#0A66C2'
    },
    {
      name: 'Twitter',
      icon: 'pi pi-twitter',
      url: 'https://twitter.com/iub_bouake',
      color: '#1DA1F2'
    },
    {
      name: 'Instagram',
      icon: 'pi pi-instagram',
      url: 'https://instagram.com/iub_bouake',
      color: '#E4405F'
    },
    {
      name: 'WhatsApp',
      icon: 'pi pi-whatsapp',
      url: 'https://wa.me/2250123456789',
      color: '#25D366'
    }
  ];

  quickLinks: QuickLink[] = [
    { label: 'Accueil', route: '/accueil' },
    { label: 'Présentation', route: '/universite/presentation' },
    { label: 'Formations', route: '/formations' },
    { label: 'Actualités', route: '/actualites' },
    { label: 'Contacts', route: '/contacts' }
  ];

  universityLinks: QuickLink[] = [
    { label: 'Les Mots du Directeur', route: '/universite/directeur' },
    { label: 'Témoignages', route: '/universite/temoingnages' },
    { label: 'Écoles Partenaires', route: '/universite/ecoles-partenaires' },
    { label: 'Entreprises Partenaires', route: '/universite/entreprises-partenaires' }
  ];

  contactInfo: ContactInfo[] = [
    {
      icon: 'pi pi-map-marker',
      label: 'Adresse',
      value: 'Bouaké, Côte d\'Ivoire'
    },
    {
      icon: 'pi pi-phone',
      label: 'Téléphone',
      value: '+225 01 23 45 67 89',
      link: 'tel:+2250123456789'
    },
    {
      icon: 'pi pi-envelope',
      label: 'Email',
      value: 'contact@iub-university.com',
      link: 'mailto:contact@iub-university.com'
    },
    {
      icon: 'pi pi-globe',
      label: 'Site Web',
      value: 'www.iub-university.com',
      link: 'https://iub-university.com'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Animation d'entrée du footer
    this.animateFooter();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  openSocialLink(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  openContactLink(link: string) {
    if (link.startsWith('tel:') || link.startsWith('mailto:')) {
      window.location.href = link;
    } else {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  private animateFooter() {
    // Animation d'apparition progressive des éléments
    setTimeout(() => {
      const footerElements = document.querySelectorAll('.footer-animate');
      footerElements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('animate-in');
        }, index * 100);
      });
    }, 200);
  }
}