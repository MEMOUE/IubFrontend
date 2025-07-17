import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { MessageService } from 'primeng/api';

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
  email: string;
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

  // Départements/Services
  departments: Department[] = [
    { label: 'Admissions', value: 'admissions', email: 'admissions@iub-university.com' },
    { label: 'Scolarité', value: 'scolarite', email: 'scolarite@iub-university.com' },
    { label: 'Recherche', value: 'recherche', email: 'recherche@iub-university.com' },
    { label: 'Partenariats', value: 'partenariats', email: 'partenariats@iub-university.com' },
    { label: 'Support Technique', value: 'support', email: 'support@iub-university.com' },
    { label: 'Direction', value: 'direction', email: 'direction@iub-university.com' },
    { label: 'Autre', value: 'autre', email: 'contact@iub-university.com' }
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
    private messageService: MessageService
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
      
      // Simulation d'envoi (remplacer par l'appel API réel)
      setTimeout(() => {
        this.isSubmitting = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Message envoyé',
          detail: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
          life: 5000
        });

        // Reset du formulaire
        this.contactForm.reset();
        this.messages = [];
        
      }, 2000);
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
    
    if (this.contactForm.get('firstName')?.errors?.['required']) {
      this.messages.push({ severity: 'error', detail: 'Le prénom est requis' });
    }
    if (this.contactForm.get('lastName')?.errors?.['required']) {
      this.messages.push({ severity: 'error', detail: 'Le nom est requis' });
    }
    if (this.contactForm.get('email')?.errors?.['required']) {
      this.messages.push({ severity: 'error', detail: 'L\'email est requis' });
    }
    if (this.contactForm.get('email')?.errors?.['email']) {
      this.messages.push({ severity: 'error', detail: 'Format d\'email invalide' });
    }
    if (this.contactForm.get('department')?.errors?.['required']) {
      this.messages.push({ severity: 'error', detail: 'Veuillez sélectionner un département' });
    }
    if (this.contactForm.get('subject')?.errors?.['required']) {
      this.messages.push({ severity: 'error', detail: 'Le sujet est requis' });
    }
    if (this.contactForm.get('message')?.errors?.['required']) {
      this.messages.push({ severity: 'error', detail: 'Le message est requis' });
    }
    if (this.contactForm.get('message')?.errors?.['minlength']) {
      this.messages.push({ severity: 'error', detail: 'Le message doit contenir au moins 20 caractères' });
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