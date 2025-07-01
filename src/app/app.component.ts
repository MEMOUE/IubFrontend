import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

// PrimeFaces imports
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenubarModule,
    ButtonModule,
    TooltipModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'iubFrontend';
  
  // Variables pour la gestion du menu
  menuItems: MenuItem[] = [];
  mobileMenuVisible = false;
  activeSubmenu: string | null = null;

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {
    // Fermer le menu mobile lors de la navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMobileMenu();
    });
  }

  ngOnInit() {
    this.initializeMenuItems();
  }

  // Initialisation des éléments de menu
  initializeMenuItems() {
    this.menuItems = [
      {
        label: 'Accueil',
        icon: 'pi pi-home',
        routerLink: '/accueil',
        styleClass: 'menu-item-home'
      },
      {
        label: 'Université',
        icon: 'pi pi-building',
        items: [
          {
            label: 'Qui Sommes Nous ?',
            icon: 'pi pi-info-circle',
            routerLink: '/universite/presentation'
          },
          {
            label: 'Les Mots du Directeur',
            icon: 'pi pi-user',
            routerLink: '/universite/directeur'
          },
          {
            label: 'Témoignages',
            icon: 'pi pi-comments',
            routerLink: '/universite/temoingnages'
          },
          {
            separator: true
          },
          {
            label: 'Écoles Partenaires',
            icon: 'pi pi-sitemap',
            routerLink: '/universite/ecoles-partenaires'
          },
          {
            label: 'Entreprises Partenaires',
            icon: 'pi pi-briefcase',
            routerLink: '/universite/entreprises-partenaires'
          }
        ]
      },
      {
        label: 'Formations',
        icon: 'pi pi-book',
        routerLink: '/formations'
      },
      {
        label: 'Actualités',
        icon: 'pi pi-calendar',
        routerLink: '/actualites'
      },
      {
        label: 'Contacts',
        icon: 'pi pi-phone',
        routerLink: '/contacts'
      }
    ];
  }

  // Navigation vers l'administration
  navigateToAdmin() {
    this.router.navigate(['/admin/login']);
    this.messageService.add({
      severity: 'info',
      summary: 'Administration',
      detail: 'Redirection vers l\'espace administrateur'
    });
  }

  // Gestion du menu mobile
  toggleMobileMenu() {
    this.mobileMenuVisible = !this.mobileMenuVisible;
    
    // Fermer tous les sous-menus quand on ferme le menu principal
    if (!this.mobileMenuVisible) {
      this.activeSubmenu = null;
    }
  }

  closeMobileMenu() {
    this.mobileMenuVisible = false;
    this.activeSubmenu = null;
  }

  // Gestion des sous-menus mobiles
  toggleSubmenu(submenu: string) {
    if (this.activeSubmenu === submenu) {
      this.activeSubmenu = null;
    } else {
      this.activeSubmenu = submenu;
    }
  }

  // Fermer le menu mobile en cliquant à l'extérieur
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const header = document.querySelector('.header-container');
    
    if (header && !header.contains(target) && this.mobileMenuVisible) {
      this.closeMobileMenu();
    }
  }

  // Fermer le menu mobile avec la touche Escape
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.mobileMenuVisible) {
      this.closeMobileMenu();
    }
  }

  // Gérer le resize de la fenêtre
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    const window = event.target as Window;
    
    // Fermer le menu mobile si on passe en mode desktop
    if (window.innerWidth > 992 && this.mobileMenuVisible) {
      this.closeMobileMenu();
    }
  }

  // Méthodes utilitaires pour le template
  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }

  isSubmenuActive(routes: string[]): boolean {
    return routes.some(route => this.router.url.startsWith(route));
  }
}