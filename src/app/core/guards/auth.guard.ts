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
    console.log('🛡️ AuthGuard.canActivate() pour:', state.url);
    return this.checkAuth(state.url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('🛡️ AuthGuard.canActivateChild() pour:', state.url);
    return this.checkAuth(state.url);
  }

  private checkAuth(url: string): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const currentUser = this.authService.getCurrentUser();
    
    console.log('🔍 AuthGuard.checkAuth():', {
      url,
      isLoggedIn,
      currentUser: currentUser ? `${currentUser.username} (${currentUser.role})` : null
    });

    if (isLoggedIn) {
      // Vérifier les rôles si nécessaire
      const requiredRole = this.getRequiredRole(url);
      
      console.log('🎭 Rôle requis:', requiredRole);
      
      if (requiredRole && !this.authService.hasRole(requiredRole)) {
        console.warn(`❌ Accès refusé. Rôle requis: ${requiredRole}, rôle actuel: ${currentUser?.role}`);
        // 🔥 CORRECTION DE LA TYPO : "alogin" -> "login"
        this.router.navigate(['/admin/login']);
        return false;
      }
      
      console.log('✅ Accès autorisé');
      return true;
    }

    // Rediriger vers la page de connexion
    console.log('❌ Utilisateur non connecté, redirection vers login');
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
    
    // Par défaut, toutes les routes admin nécessitent au moins le rôle ADMIN ou SUPER_ADMIN
    if (url.includes('/admin')) {
      // Accepter les deux rôles pour l'admin
      const user = this.authService.getCurrentUser();
      if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
        return null; // Accès autorisé
      }
      return 'ADMIN'; // Rôle requis
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
    console.log('🛡️ SuperAdminGuard.canActivate()');
    
    const isLoggedIn = this.authService.isLoggedIn();
    const isSuperAdmin = this.authService.isSuperAdmin();
    
    console.log('🔍 SuperAdminGuard check:', { isLoggedIn, isSuperAdmin });

    if (isLoggedIn && isSuperAdmin) {
      console.log('✅ SuperAdmin accès autorisé');
      return true;
    }

    console.warn('❌ Accès refusé. Rôle SUPER_ADMIN requis.');
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
    console.log('🛡️ NoAuthGuard.canActivate()');
    
    const isLoggedIn = this.authService.isLoggedIn();
    console.log('🔍 NoAuthGuard check - isLoggedIn:', isLoggedIn);

    if (!isLoggedIn) {
      console.log('✅ Utilisateur non connecté, accès à login autorisé');
      return true;
    }

    // 🔥 REDIRIGER VERS LE DASHBOARD SI DÉJÀ CONNECTÉ
    console.log('🚀 Utilisateur déjà connecté, redirection vers dashboard');
    this.router.navigate(['/admin/dashboard']);
    return false;
  }
}