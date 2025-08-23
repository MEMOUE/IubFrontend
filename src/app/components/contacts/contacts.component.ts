import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { MessageService } from 'primeng/api';
import { ContactService, ContactRequest } from '../../core/services/contact.service';

// Interface pour les messages
interface Message {
  severity?: string;
  summary?: string;
  detail?: string;
  life?: number;
}

interface ContactInfo {
  icon: string;
  title: string;
  value: string;
  description: string;
  link?: string;
  color: string;
}

interface SocialLink {
  name: string;
  icon: string;
  url: string;
  color: string;
}

interface Department {
  label: string;
  value: string;
}

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    MessageModule,
    MessagesModule,
    ToastModule,
    CardModule,
    DividerModule,
    TagModule,
    TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent implements OnInit, OnDestroy {

  contactForm: FormGroup;
  messages: Message[] = [];
  isSubmitting = false;

  // Informations de contact
  contactInfos: ContactInfo[] = [
    {
      icon: 'pi pi-map-marker',
      title: 'Adresse',
      value: 'Bouaké, Côte d\'Ivoire',
      description: 'Campus principal de l\'IUB',
      color: '#B85450'
    },
    {
      icon: 'pi pi-phone',
      title: 'Téléphone',
      value: '+225 27 31 63 85 20',
      description: 'Lundi - Vendredi, 8h - 17h',
      link: 'tel:+2252731638520',
      color: '#5A7C59'
    },
    {
      icon: 'pi pi-envelope',
      title: 'Email',
      value: 'contact@iub-university.com',
      description: 'Réponse sous 24h',
      link: 'mailto:contact@iub-university.com',
      color: '#6B6B6B'
    },
    {
      icon: 'pi pi-globe',
      title: 'Site Web',
      value: 'www.iub-university.com',
      description: 'Portail officiel',
      link: 'https://www.iub-university.com',
      color: '#B85450'
    }
  ];

  // Départements/Services - Correspond au backend
  departments: Department[] = [
    { label: 'Admissions', value: 'Admissions' },
    { label: 'Scolarité', value: 'Scolarité' },
    { label: 'Recherche', value: 'Recherche' },
    { label: 'Partenariats', value: 'Partenariats' },
    { label: 'Support Technique', value: 'Support Technique' },
    { label: 'Direction', value: 'Direction' },
    { label: 'Autre', value: 'Autre' }
  ];

  // Réseaux sociaux
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
      name: 'YouTube',
      icon: 'pi pi-youtube',
      url: 'https://youtube.com/c/iub-bouake',
      color: '#FF0000'
    },
    {
      name: 'WhatsApp',
      icon: 'pi pi-whatsapp',
      url: 'https://wa.me/2252731638520',
      color: '#25D366'
    }
  ];

  // Heures d'ouverture
  openingHours = [
    { day: 'Lundi - Vendredi', hours: '8h00 - 17h00' },
    { day: 'Samedi', hours: '8h00 - 12h00' },
    { day: 'Dimanche', hours: 'Fermé' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private contactService: ContactService
  ) {
    this.contactForm = this.createContactForm();
  }

  ngOnInit() {
    this.animateElements();
  }

  ngOnDestroy() {
    // Nettoyage si nécessaire
  }

  // Création du formulaire avec validation
  private createContactForm(): FormGroup {
    return this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[+]?[0-9\s\-\(\)]{8,}$/)]],
      department: ['', Validators.required],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]]
    });
  }

  // Soumission du formulaire
  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      const contactData: ContactRequest = {
        firstName: this.contactForm.value.firstName.trim(),
        lastName: this.contactForm.value.lastName.trim(),
        email: this.contactForm.value.email.trim(),
        phone: this.contactForm.value.phone?.trim() || undefined,
        department: this.contactForm.value.department,
        subject: this.contactForm.value.subject.trim(),
        message: this.contactForm.value.message.trim()
      };

      console.log('📧 Envoi du message de contact:', contactData);

      this.contactService.sendMessage(contactData).subscribe({
        next: (response) => {
          console.log('✅ Réponse reçue:', response);
          this.isSubmitting = false;

          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Message envoyé',
              detail: response.message || 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
              life: 5000
            });

            // Reset du formulaire
            this.contactForm.reset();
            this.messages = [];
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: response.message || 'Erreur lors de l\'envoi du message',
              life: 5000
            });
          }
        },
        error: (error) => {
          console.error('❌ Erreur lors de l\'envoi:', error);
          this.isSubmitting = false;

          let errorMessage = 'Une erreur est survenue lors de l\'envoi du message';

          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Erreur d\'envoi',
            detail: errorMessage,
            life: 5000
          });

          // Afficher les erreurs de validation si disponibles
          if (error.status === 400 && error.error?.errors) {
            this.showValidationErrors();
          }
        }
      });
    } else {
      this.markFormGroupTouched();
      this.showValidationErrors();
    }
  }

  // Marquer tous les champs comme touchés pour afficher les erreurs
  private markFormGroupTouched() {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Afficher les erreurs de validation
  private showValidationErrors() {
    this.messages = [];

    const errors = [];

    if (this.contactForm.get('firstName')?.errors?.['required']) {
      errors.push('Le prénom est requis');
    }
    if (this.contactForm.get('lastName')?.errors?.['required']) {
      errors.push('Le nom est requis');
    }
    if (this.contactForm.get('email')?.errors?.['required']) {
      errors.push('L\'email est requis');
    }
    if (this.contactForm.get('email')?.errors?.['email']) {
      errors.push('Format d\'email invalide');
    }
    if (this.contactForm.get('department')?.errors?.['required']) {
      errors.push('Veuillez sélectionner un département');
    }
    if (this.contactForm.get('subject')?.errors?.['required']) {
      errors.push('Le sujet est requis');
    }
    if (this.contactForm.get('message')?.errors?.['required']) {
      errors.push('Le message est requis');
    }
    if (this.contactForm.get('message')?.errors?.['minlength']) {
      errors.push('Le message doit contenir au moins 20 caractères');
    }

    if (errors.length > 0) {
      this.messages.push({
        severity: 'error',
        summary: 'Erreurs de validation',
        detail: errors.join(', ')
      });
    }
  }

  // Vérifier si un champ a une erreur
  hasError(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Obtenir le message d'erreur pour un champ
  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['email']) return 'Format d\'email invalide';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['maxlength']) return `Maximum ${field.errors['maxlength'].requiredLength} caractères`;
      if (field.errors['pattern']) return 'Format invalide';
    }
    return '';
  }

  // Ouvrir un lien de contact
  openContactLink(link: string) {
    if (link.startsWith('tel:') || link.startsWith('mailto:')) {
      window.location.href = link;
    } else {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  }

  // Ouvrir un lien de réseau social
  openSocialLink(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Animation des éléments
  private animateElements() {
    setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('animated');
        }, index * 100);
      });
    }, 100);
  }

  // Obtenir la classe CSS pour l'état du champ
  getFieldClass(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field && field.touched) {
      return field.invalid ? 'ng-invalid ng-dirty' : 'ng-valid';
    }
    return '';
  }

  // Compter les caractères du message
  getMessageCharCount(): number {
    const messageValue = this.contactForm.get('message')?.value || '';
    return messageValue.length;
  }

  // Obtenir la couleur pour le compteur de caractères
  getCharCountColor(): string {
    const count = this.getMessageCharCount();
    if (count < 20) return '#dc3545'; // Rouge
    if (count > 900) return '#fd7e14'; // Orange
    return '#28a745'; // Vert
  }
}
