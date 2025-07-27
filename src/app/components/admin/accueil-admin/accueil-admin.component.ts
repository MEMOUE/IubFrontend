import { Component, OnInit, inject, signal, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

// Services
import { AuthService, UserSession } from '../../../core/services/auth.service';

@Component({
  selector: 'app-accueil-admin',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule, 
    CardModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './accueil-admin.component.html',
  styleUrl: './accueil-admin.component.css'
})
export class AccueilAdminComponent implements OnInit, OnDestroy {
  // Injection des dépendances
  private router = inject(Router);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private destroy$ = new Subject<void>();

  // Signals pour l'état de l'utilisateur
  currentUser = signal<UserSession | null>(null);
  isAuthenticated = signal(false);

  constructor() { }

  ngOnInit(): void {
    this.initializeUserState();
    console.log('Dashboard Admin initialisé');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialise l'état de l'utilisateur
   */
  private initializeUserState(): void {
    // S'abonner aux changements d'état d'authentification
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.currentUser.set(user);
      this.isAuthenticated.set(!!user);
      
      // Si plus connecté, rediriger vers login
      if (!user) {
        this.router.navigate(['/admin/login']);
      }
    });

    // Initialiser avec l'état actuel
    const user = this.authService.getCurrentUser();
    this.currentUser.set(user);
    this.isAuthenticated.set(this.authService.isLoggedIn());

    // Vérifier que l'utilisateur est bien connecté
    if (!this.isAuthenticated()) {
      this.router.navigate(['/admin/login']);
      return;
    }

    // Afficher un message de bienvenue
    const currentUser = this.currentUser();
    if (currentUser) {
      this.messageService.add({
        severity: 'success',
        summary: 'Bienvenue !',
        detail: `Bonjour ${currentUser.prenom} ${currentUser.nom}`,
        life: 3000
      });
    }
  }

  /**
   * Navigation vers une route spécifique
   * @param route - La route vers laquelle naviguer
   */
  navigateTo(route: string): void {
    this.router.navigate([route]).catch(error => {
      console.error('Erreur de navigation:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Erreur lors de la navigation',
        life: 3000
      });
    });
  }

  /**
   * Confirmation de déconnexion
   */
  confirmLogout(): void {
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
      }
    });
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
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

  /**
   * Actions rapides avec feedback visuel
   */
  onQuickAction(action: string): void {
    console.log(`Action rapide: ${action}`);
    // Ici vous pouvez ajouter une logique spécifique pour chaque action
    switch(action) {
      case 'utilisateurs':
        this.navigateTo('admin/utilisateurs');
        break;
      case 'parametres':
        this.navigateTo('admin/parametres');
        break;
      case 'rapports':
        this.navigateTo('admin/rapports');
        break;
      case 'sauvegarde':
        this.performBackup();
        break;
      default:
        this.navigateTo(`admin/${action}`);
    }
  }

  /**
   * Effectuer une sauvegarde (exemple)
   */
  private performBackup(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Sauvegarde',
      detail: 'Sauvegarde en cours...',
      life: 2000
    });

    // Simulation d'une sauvegarde
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sauvegarde',
        detail: 'Sauvegarde terminée avec succès',
        life: 3000
      });
    }, 2000);
  }

  /**
   * Actualiser les informations utilisateur
   */
  async refreshUserInfo(): Promise<void> {
    try {
      await this.authService.refreshUserInfo();
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Informations utilisateur mises à jour',
        life: 3000
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Erreur lors de la mise à jour des informations',
        life: 5000
      });
    }
  }

  /**
   * Obtient le nom complet de l'utilisateur
   */
  getUserFullName(): string {
    const user = this.currentUser();
    return user ? `${user.prenom} ${user.nom}` : 'Utilisateur';
  }

  /**
   * Obtient le rôle formaté de l'utilisateur
   */
  getUserRole(): string {
    const user = this.currentUser();
    if (!user) return '';
    
    switch (user.role) {
      case 'SUPER_ADMIN':
        return 'Super Administrateur';
      case 'ADMIN':
        return 'Administrateur';
      default:
        return user.role;
    }
  }

  /**
   * Vérifie si c'est un super admin
   */
  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  /**
   * Vérifie si c'est la première connexion
   */
  isFirstLogin(): boolean {
    return this.authService.isFirstLogin();
  }

  /**
   * Obtient l'email de l'utilisateur
   */
  getUserEmail(): string {
    const user = this.currentUser();
    return user?.email || '';
  }

  /**
   * Affiche les informations détaillées de l'utilisateur
   */
  showUserDetails(): void {
    const user = this.currentUser();
    if (user) {
      this.messageService.add({
        severity: 'info',
        summary: 'Informations utilisateur',
        detail: `ID: ${user.id} | Username: ${user.username} | Email: ${user.email}`,
        life: 5000
      });
    }
  }
}