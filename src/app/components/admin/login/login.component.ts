// login.component.ts
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  // Signals pour la gestion de l'état
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  // Formulaire réactif
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  // Méthodes utilitaires
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  togglePassword(): void {
    this.showPassword.update(show => !show);
  }

  // Gestion de la soumission du formulaire
  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      try {
        const formData = this.loginForm.value;
        
        // Appel au service d'authentification
        const response = await this.authService.login({
          email: formData.email,
          password: formData.password
        });

        // Gérer le "Se souvenir de moi" si nécessaire
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        // Vérifier si c'est la première connexion
        if (this.authService.isFirstLogin()) {
          console.log('Première connexion détectée');
          // Optionnel: rediriger vers changement de mot de passe
          // this.router.navigate(['/admin/change-password']);
        }
          
        // Redirection vers le dashboard admin
        this.router.navigate(['/admin/dashboard']);
        
      } catch (error: any) {
        console.error('Erreur de connexion:', error);
        this.errorMessage.set(error.message || 'Une erreur est survenue lors de la connexion');
      } finally {
        this.isLoading.set(false);
      }
    } else {
      // Marquer tous les champs comme touched pour afficher les erreurs
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  // Gestion du mot de passe oublié
  onForgotPassword(): void {
    this.router.navigate(['/admin/forgot-password']);
  }

  // Méthode pour vérifier l'état de connexion (optionnelle - pour le développement)
  checkConnectionStatus(): void {
    console.log('Utilisateur connecté:', this.authService.isLoggedIn());
    console.log('Utilisateur actuel:', this.authService.getCurrentUser());
  }
}