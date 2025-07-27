// auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';

// Interfaces pour l'authentification
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AdministrateurInfo {
  id: number;
  username: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  premiereConnexion: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  administrateur: AdministrateurInfo | null;
}

export interface UserSession {
  id: number;
  username: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  premiereConnexion: boolean;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  // Subject pour suivre l'état de connexion
  private currentUserSubject = new BehaviorSubject<UserSession | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Signals pour l'état d'authentification
  public isAuthenticated = signal(false);
  public currentUser = signal<UserSession | null>(null);

  constructor() {
    // Vérifier s'il y a déjà une session en cours au démarrage
    this.checkExistingSession();
  }

  /**
   * Connexion de l'utilisateur
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.apiService.post<LoginResponse>(
        'administrateurs/login',
        credentials
      ).toPromise();

      if (response?.success && response.administrateur) {
        // Créer la session utilisateur
        const userSession = this.createUserSession(response.administrateur);
        
        // Sauvegarder la session
        this.saveSession(userSession);
        
        // Mettre à jour l'état
        this.updateAuthState(userSession);
        
        return response;
      } else {
        throw new Error(response?.message || 'Erreur de connexion');
      }
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      
      if (error.status === 401) {
        throw new Error('Email ou mot de passe incorrect');
      } else if (error.status === 0) {
        throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
      } else {
        throw new Error(error.error?.message || 'Une erreur est survenue lors de la connexion');
      }
    }
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    // Supprimer toutes les données de session
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('rememberMe');

    // Réinitialiser l'état
    this.updateAuthState(null);

    // Rediriger vers la page de connexion
    this.router.navigate(['/admin/login']);
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Obtenir les informations de l'utilisateur actuel
   */
  getCurrentUser(): UserSession | null {
    return this.currentUser();
  }

  /**
   * Vérifier le rôle de l'utilisateur
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Vérifier si c'est un super admin
   */
  isSuperAdmin(): boolean {
    return this.hasRole('SUPER_ADMIN');
  }

  /**
   * Vérifier si c'est la première connexion
   */
  isFirstLogin(): boolean {
    const user = this.getCurrentUser();
    return user?.premiereConnexion || false;
  }

  /**
   * Obtenir le token d'authentification
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Rafraîchir les informations utilisateur
   */
  async refreshUserInfo(): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) return;

    try {
      const response = await this.apiService.get<AdministrateurInfo>(
        `administrateurs/${user.id}`
      ).toPromise();

      if (response) {
        const updatedSession: UserSession = {
          ...user,
          nom: response.nom,
          prenom: response.prenom,
          email: response.email,
          username: response.username,
          role: response.role,
          premiereConnexion: response.premiereConnexion
        };

        this.saveSession(updatedSession);
        this.updateAuthState(updatedSession);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des infos utilisateur:', error);
    }
  }

  /**
   * Vérifier s'il existe une session existante
   */
  private checkExistingSession(): void {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const userSession: UserSession = { ...user, token };
        this.updateAuthState(userSession);
      } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        this.clearSession();
      }
    }
  }

  /**
   * Créer une session utilisateur
   */
  private createUserSession(admin: AdministrateurInfo): UserSession {
    // Génération d'un token simple (dans un vrai projet, le backend fournirait un JWT)
    const token = `jwt-token-${Date.now()}-${admin.id}`;

    return {
      id: admin.id,
      username: admin.username,
      nom: admin.nom,
      prenom: admin.prenom,
      email: admin.email,
      role: admin.role,
      premiereConnexion: admin.premiereConnexion,
      token: token
    };
  }

  /**
   * Sauvegarder la session dans le localStorage
   */
  private saveSession(userSession: UserSession): void {
    localStorage.setItem('authToken', userSession.token);
    localStorage.setItem('userRole', userSession.role);
    localStorage.setItem('user', JSON.stringify({
      id: userSession.id,
      username: userSession.username,
      nom: userSession.nom,
      prenom: userSession.prenom,
      email: userSession.email,
      role: userSession.role,
      premiereConnexion: userSession.premiereConnexion
    }));
  }

  /**
   * Mettre à jour l'état d'authentification
   */
  private updateAuthState(userSession: UserSession | null): void {
    this.isAuthenticated.set(!!userSession);
    this.currentUser.set(userSession);
    this.currentUserSubject.next(userSession);
  }

  /**
   * Effacer la session
   */
  private clearSession(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('rememberMe');
    this.updateAuthState(null);
  }

  /**
   * Vérifier la validité du token (optionnel - pour une vraie application)
   */
  async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Ici on pourrait faire un appel au backend pour valider le token
      // Pour l'instant, on fait une vérification simple
      const user = this.getCurrentUser();
      if (user) {
        // Optionnel: appel au backend pour vérifier que l'utilisateur existe toujours
        await this.apiService.get(`administrateurs/${user.id}`).toPromise();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token invalide:', error);
      this.clearSession();
      return false;
    }
  }
}