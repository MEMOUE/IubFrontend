import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

import { MessageService } from 'primeng/api';
import { ActualiteService } from '../../../core/services/actualite.service';
import { Actualite, CreateActualiteDto } from '../../../shared/models/actualite.model';

@Component({
  selector: 'app-newactualites',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    FileUploadModule,
    ToastModule,
    CardModule,
    DividerModule
  ],
  providers: [MessageService],
  templateUrl: './newactualites.component.html',
  styleUrl: './newactualites.component.css'
})
export class NewactualitesComponent implements OnInit {

  actualiteForm: FormGroup;
  categories: any[] = [];
  isEditMode = false;
  actualiteId?: number;
  loading = false;
  submitting = false;
  
  // Gestion d'image améliorée
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  externalImageUrl: string = '';
  useExternalUrl: boolean = true; // Par défaut, utiliser URL externe

  // Constantes pour la validation
  private readonly MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
  private readonly MAX_IMAGE_DATA_URL_LENGTH = 10000; // ~10KB en base64

  constructor(
    private formBuilder: FormBuilder,
    private actualiteService: ActualiteService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.actualiteForm = this.createForm();
    this.initializeCategories();
  }

  ngOnInit() {
    // Vérifier si on est en mode édition
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.actualiteId = Number(id);
        this.isEditMode = true;
        this.loadActualite();
      }
    });
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      // Utiliser les noms de champs du backend
      titre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      contenu: ['', [Validators.minLength(50)]],
      categorie: ['', Validators.required],
      publie: [false],
      datePublication: [new Date(), Validators.required],
      dateEvenement: [null],
      auteur: ['', Validators.required] // Rendu obligatoire
    });
  }

  initializeCategories() {
    this.categories = [
      { label: 'Événement', value: 'evenement', icon: 'pi pi-calendar' },
      { label: 'Actualité', value: 'news', icon: 'pi pi-globe' },
      { label: 'Cérémonie', value: 'ceremonie', icon: 'pi pi-star' },
      { label: 'Formation', value: 'formation', icon: 'pi pi-book' },
      { label: 'Partenariat', value: 'partenariat', icon: 'pi pi-handshake' },
      { label: 'Recherche', value: 'recherche', icon: 'pi pi-search' }
    ];
  }

  loadActualite() {
    if (!this.actualiteId) return;
    
    this.loading = true;
    this.actualiteService.getActualiteById(this.actualiteId).subscribe({
      next: (actualite) => {
        this.populateForm(actualite);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger l\'actualité'
        });
        this.router.navigate(['/actualites']);
      }
    });
  }

  populateForm(actualite: Actualite) {
    this.actualiteForm.patchValue({
      titre: actualite.titre,
      description: actualite.description,
      contenu: actualite.contenu || '',
      categorie: actualite.categorie,
      publie: actualite.publie,
      datePublication: actualite.datePublication ? new Date(actualite.datePublication) : new Date(),
      dateEvenement: actualite.dateEvenement ? new Date(actualite.dateEvenement) : null,
      auteur: actualite.auteur || ''
    });

    // Charger l'image existante
    if (actualite.imageUrl) {
      this.imagePreview = actualite.imageUrl;
      this.externalImageUrl = actualite.imageUrl;
    }
  }

  onSubmit() {
    if (this.actualiteForm.valid) {
      this.submitting = true;

      const formData = this.actualiteForm.value;
      
      // CORRECTION PRINCIPALE : Gestion sécurisée de l'URL d'image
      let imageUrl = this.imagePreview || '';
      
      // Si l'image est en base64 et trop longue, ne pas l'inclure
      if (imageUrl.startsWith('data:') && imageUrl.length > this.MAX_IMAGE_DATA_URL_LENGTH) {
        imageUrl = ''; // Remplacer par une chaîne vide
        
        this.messageService.add({
          severity: 'warn',
          summary: 'Image ignorée',
          detail: 'L\'image était trop volumineuse et n\'a pas été sauvegardée. Utilisez une URL d\'image externe.'
        });
      }
      
      // Validation finale des données
      if (!formData.titre || !formData.description || !formData.categorie || !formData.auteur) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur de validation',
          detail: 'Veuillez remplir tous les champs obligatoires'
        });
        this.submitting = false;
        return;
      }

      const actualiteData: CreateActualiteDto = {
        titre: formData.titre.trim(),
        description: formData.description.trim(),
        contenu: formData.contenu?.trim() || '',
        categorie: formData.categorie,
        publie: formData.publie,
        imageUrl: imageUrl, // URL corrigée et limitée
        datePublication: this.formatDateForBackend(formData.datePublication),
        dateEvenement: formData.dateEvenement ? this.formatDateForBackend(formData.dateEvenement) : undefined,
        auteur: formData.auteur.trim()
      };

      // Debug log
      console.log('Données envoyées:', actualiteData);
      console.log('Taille imageUrl:', actualiteData.imageUrl?.length || 0);

      if (this.isEditMode && this.actualiteId) {
        this.updateActualite(actualiteData);
      } else {
        this.createActualite(actualiteData);
      }
    } else {
      this.markFormGroupTouched();
      this.showValidationErrors();
    }
  }

  // Méthode pour formater la date pour le backend
  private formatDateForBackend(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Afficher les erreurs de validation
  private showValidationErrors() {
    const errors = [];
    
    if (this.actualiteForm.get('titre')?.errors) {
      errors.push('Le titre est requis (5-200 caractères)');
    }
    if (this.actualiteForm.get('description')?.errors) {
      errors.push('La description est requise (20-500 caractères)');
    }
    if (this.actualiteForm.get('categorie')?.errors) {
      errors.push('La catégorie est requise');
    }
    if (this.actualiteForm.get('auteur')?.errors) {
      errors.push('L\'auteur est requis');
    }
    if (this.actualiteForm.get('datePublication')?.errors) {
      errors.push('La date de publication est requise');
    }

    this.messageService.add({
      severity: 'warn',
      summary: 'Erreurs de validation',
      detail: errors.join(', ')
    });
  }

  createActualite(data: CreateActualiteDto) {
    this.actualiteService.createActualite(data).subscribe({
      next: (actualite) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Actualité créée avec succès'
        });
        this.router.navigate(['/actualites']);
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.message || 'Impossible de créer l\'actualité'
        });
        this.submitting = false;
      }
    });
  }

  updateActualite(data: CreateActualiteDto) {
    this.actualiteService.updateActualite(this.actualiteId!, data).subscribe({
      next: (actualite) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Actualité modifiée avec succès'
        });
        this.router.navigate(['/actualites']);
      },
      error: (error) => {
        console.error('Erreur lors de la modification:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.message || 'Impossible de modifier l\'actualité'
        });
        this.submitting = false;
      }
    });
  }

  // Gestion de l'URL d'image externe
  onExternalImageUrlChange() {
    if (this.externalImageUrl && this.externalImageUrl.trim()) {
      try {
        new URL(this.externalImageUrl);
        this.imagePreview = this.externalImageUrl;
        this.selectedFile = null; // Réinitialiser le fichier sélectionné
        
        this.messageService.add({
          severity: 'success',
          summary: 'URL d\'image valide',
          detail: 'L\'image externe a été chargée'
        });
      } catch {
        this.messageService.add({
          severity: 'warn',
          summary: 'URL invalide',
          detail: 'Veuillez entrer une URL d\'image valide'
        });
      }
    } else {
      this.imagePreview = null;
    }
  }

  // Gestion du fichier avec compression
  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      // Vérifications de base
      if (file.size > this.MAX_IMAGE_SIZE) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Fichier trop volumineux',
          detail: 'L\'image ne doit pas dépasser 2MB'
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Type de fichier invalide',
          detail: 'Veuillez sélectionner une image'
        });
        return;
      }

      this.selectedFile = file;
      this.externalImageUrl = ''; // Réinitialiser l'URL externe
      
      // Avertir l'utilisateur de la limitation
      this.messageService.add({
        severity: 'info',
        summary: 'Limitation d\'image',
        detail: 'Pour éviter les erreurs, utilisez de préférence des URLs d\'images externes'
      });

      // Créer une prévisualisation sans sauvegarder en base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        
        // Si l'image est trop grande en base64, ne pas l'utiliser
        if (dataUrl.length > this.MAX_IMAGE_DATA_URL_LENGTH) {
          this.imagePreview = URL.createObjectURL(file); // Préview temporaire
          
          this.messageService.add({
            severity: 'warn',
            summary: 'Image trop volumineuse',
            detail: 'Cette image ne sera pas sauvegardée. Utilisez une URL externe.'
          });
        } else {
          this.imagePreview = dataUrl;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onFileRemove() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.externalImageUrl = '';
    
    this.messageService.add({
      severity: 'info',
      summary: 'Image supprimée',
      detail: 'L\'image a été supprimée'
    });
  }

  // Gestion d'erreur d'image
  onImageError() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Image non accessible',
      detail: 'L\'image à cette URL n\'est pas accessible'
    });
    this.imagePreview = null;
  }

  onImageLoad() {
    // Image chargée avec succès - pas de message pour éviter le spam
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  markFormGroupTouched() {
    Object.keys(this.actualiteForm.controls).forEach(key => {
      const control = this.actualiteForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Méthodes utilitaires pour le template
  hasError(fieldName: string): boolean {
    const field = this.actualiteForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.actualiteForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['maxlength']) return `Maximum ${field.errors['maxlength'].requiredLength} caractères`;
    }
    return '';
  }

  getFieldClass(fieldName: string): string {
    const field = this.actualiteForm.get(fieldName);
    if (field && field.touched) {
      return field.invalid ? 'p-invalid' : '';
    }
    return '';
  }

  cancel() {
    this.router.navigate(['/actualites']);
  }

  preview() {
    if (this.actualiteForm.valid) {
      this.messageService.add({
        severity: 'info',
        summary: 'Prévisualisation',
        detail: 'Fonctionnalité à implémenter'
      });
    }
  }

  saveDraft() {
    // Forcer la sauvegarde en brouillon
    this.actualiteForm.patchValue({ publie: false });
    this.onSubmit();
  }

  // Getters pour faciliter l'accès aux contrôles du formulaire
  get titreCharCount(): number {
    return this.actualiteForm.get('titre')?.value?.length || 0;
  }

  get descriptionCharCount(): number {
    return this.actualiteForm.get('description')?.value?.length || 0;
  }

  get contenuCharCount(): number {
    return this.actualiteForm.get('contenu')?.value?.length || 0;
  }

  getCharCountColor(count: number, max: number): string {
    const ratio = count / max;
    if (ratio > 0.9) return '#dc3545';
    if (ratio > 0.7) return '#fd7e14';
    return '#28a745';
  }
}