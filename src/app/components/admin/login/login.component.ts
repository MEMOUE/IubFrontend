// login.component.ts
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
        
        // Simulation d'un appel API
        await this.authenticateUser(formData);
        
        // Redirection vers le dashboard admin
        this.router.navigate(['/admin/dashboard']);
        
      } catch (error) {
        this.errorMessage.set('Email ou mot de passe incorrect');
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

  // Simulation d'authentification (à remplacer par votre service)
  private async authenticateUser(credentials: any): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulation des identifiants de démonstration
        if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
          // Stocker le token ou les informations d'authentification
          if (credentials.rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }
          localStorage.setItem('authToken', 'demo-jwt-token');
          localStorage.setItem('userRole', 'admin');
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 2000); // Simulation de délai réseau
    });
  }

  // Gestion du mot de passe oublié
  onForgotPassword(): void {
    this.router.navigate(['/admin/forgot-password']);
  }
}