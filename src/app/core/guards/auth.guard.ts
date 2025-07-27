// auth.guard.ts
import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAuth(state.url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAuth(state.url);
  }

  private checkAuth(url: string): boolean {
    if (this.authService.isLoggedIn()) {
      // Vérifier les rôles si nécessaire
      const requiredRole = this.getRequiredRole(url);
      
      if (requiredRole && !this.authService.hasRole(requiredRole)) {
        console.warn(`Accès refusé. Rôle requis: ${requiredRole}`);
        this.router.navigate(['/admin/alogin']);
        return false;
      }
      
      return true;
    }

    // Rediriger vers la page de connexion
    console.log('Utilisateur non connecté, redirection vers login');
    this.router.navigate(['/admin/login'], { 
      queryParams: { returnUrl: url } 
    });
    return false;
  }

  /**
   * Détermine le rôle requis en fonction de l'URL
   */
  private getRequiredRole(url: string): string | null {
    // Exemple de logique pour déterminer les rôles requis
    if (url.includes('/admin/users') || url.includes('/admin/settings')) {
      return 'SUPER_ADMIN';
    }
    
    // Par défaut, toutes les routes admin nécessitent au moins le rôle ADMIN
    if (url.includes('/admin')) {
      return 'ADMIN';
    }
    
    return null;
  }
}

/**
 * Guard spécifique pour les super admins
 */
@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.authService.isLoggedIn() && this.authService.isSuperAdmin()) {
      return true;
    }

    console.warn('Accès refusé. Rôle SUPER_ADMIN requis.');
    this.router.navigate(['/admin/login']);
    return false;
  }
}

/**
 * Guard pour rediriger les utilisateurs déjà connectés
 */
@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      return true;
    }

    // Rediriger vers le dashboard si déjà connecté
    this.router.navigate(['/admin/dashboard']);
    return false;
  }
}