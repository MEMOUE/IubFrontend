import { Component, OnInit, HostListener, inject, signal, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// PrimeFaces imports
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

// Import du composant Footer et services
import { FooterComponent } from './components/footer/footer.component';
import { AuthService, UserSession } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenubarModule,
    ButtonModule,
    TooltipModule,
    ToastModule,
    ConfirmDialogModule,
    FooterComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'iubFrontend';
  
  // Injection des dépendances
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  
  // Variables pour la gestion du menu
  menuItems: MenuItem[] = [];
  mobileMenuVisible = false;
  activeSubmenu: string | null = null;

  // Signals pour l'état d'authentification
  isAuthenticated = signal(false);
  currentUser = signal<UserSession | null>(null);

  constructor() {
    // Fermer le menu mobile lors de la navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.closeMobileMenu();
    });
  }

  ngOnInit() {
    this.initializeMenuItems();
    this.initializeAuthState();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Initialisation de l'état d'authentification
  private initializeAuthState() {
    // S'abonner aux changements d'état d'authentification
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.isAuthenticated.set(!!user);
      this.currentUser.set(user);
    });

    // Initialiser avec l'état actuel
    this.isAuthenticated.set(this.authService.isLoggedIn());
    this.currentUser.set(this.authService.getCurrentUser());
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

  // Navigation vers l'administration ou déconnexion
  onAdminButtonClick() {
    if (this.isAuthenticated()) {
      // Si connecté, afficher le menu utilisateur ou se déconnecter directement
      this.confirmLogout();
    } else {
      // Si pas connecté, aller vers la page de connexion
      this.navigateToAdmin();
    }
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

  // Navigation vers le dashboard admin
  navigateToDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  // Confirmation de déconnexion
  confirmLogout() {
    const user = this.currentUser();
    const userName = user ? `${user.prenom} ${user.nom}` : 'Administrateur';

    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir vous déconnecter, ${userName} ?`,
      header: 'Confirmation de déconnexion',
      icon: 'pi pi-sign-out',
      acceptLabel: 'Oui, déconnecter',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.logout();
      },
      reject: () => {
        // L'utilisateur a annulé
      }
    });
  }

  // Déconnexion
  logout() {
    const user = this.currentUser();
    const userName = user ? `${user.prenom} ${user.nom}` : 'Administrateur';

    try {
      this.authService.logout();
      
      this.messageService.add({
        severity: 'success',
        summary: 'Déconnexion réussie',
        detail: `Au revoir ${userName} ! Vous avez été déconnecté avec succès.`,
        life: 3000
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Une erreur est survenue lors de la déconnexion',
        life: 5000
      });
    }
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

  // Obtenir l'icône du bouton admin selon l'état
  getAdminButtonIcon(): string {
    return this.isAuthenticated() ? 'pi pi-sign-out' : 'pi pi-user';
  }

  // Obtenir le tooltip du bouton admin selon l'état
  getAdminButtonTooltip(): string {
    if (this.isAuthenticated()) {
      const user = this.currentUser();
      return user ? `Déconnecter ${user.prenom} ${user.nom}` : 'Se déconnecter';
    }
    return 'Administration';
  }

  // Obtenir le style du bouton admin selon l'état
  getAdminButtonClass(): string {
    return this.isAuthenticated() 
      ? 'p-button-text p-button-rounded admin-btn admin-btn-logout' 
      : 'p-button-text p-button-rounded admin-btn';
  }
}