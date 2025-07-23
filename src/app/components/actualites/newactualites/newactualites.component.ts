import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

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
import { UploadService } from '../../../core/services/upload.service';
import { Actualite, CreateActualiteDto } from '../../../shared/models/actualite.model';

@Component({
  selector: 'app-newactualites',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  uploadingImage = false;
  
  // Preview
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  uploadedImageUrl: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private actualiteService: ActualiteService,
    private uploadService: UploadService,
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
      titre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      contenu: ['', [Validators.minLength(50)]],
      categorie: ['', Validators.required],
      auteur: ['', [Validators.required, Validators.minLength(2)]],
      publie: [false],
      datePublication: [new Date().toISOString().split('T')[0], Validators.required],
      dateEvenement: ['']
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
      auteur: actualite.auteur,
      publie: actualite.publie,
      datePublication: actualite.datePublication,
      dateEvenement: actualite.dateEvenement || ''
    });

    // Charger l'image existante
    if (actualite.imageUrl) {
      this.imagePreview = actualite.imageUrl;
      this.uploadedImageUrl = actualite.imageUrl;
    }
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Créer une prévisualisation locale
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // Uploader le fichier immédiatement
      this.uploadImage(file);
    }
  }

  uploadImage(file: File) {
    this.uploadingImage = true;
    
    this.uploadService.uploadActualiteImage(file).subscribe({
      next: (response) => {
        this.uploadedImageUrl = response.url;
        this.uploadingImage = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Image uploadée',
          detail: `${response.filename} - ${this.formatFileSize(file.size)}`
        });
      },
      error: (error) => {
        console.error('Erreur upload:', error);
        this.uploadingImage = false;
        
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur d\'upload',
          detail: error.error?.error || 'Impossible d\'uploader l\'image'
        });
        
        // Reset en cas d'erreur
        this.onFileRemove();
      }
    });
  }

  onFileRemove() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.uploadedImageUrl = null;
    
    this.messageService.add({
      severity: 'info',
      summary: 'Image supprimée',
      detail: 'L\'image a été supprimée'
    });
  }

  onSubmit() {
    if (this.actualiteForm.valid) {
      this.submitting = true;

      const formData = this.actualiteForm.value;
      const actualiteData: CreateActualiteDto = {
        titre: formData.titre,
        description: formData.description,
        contenu: formData.contenu,
        categorie: formData.categorie,
        auteur: formData.auteur,
        publie: formData.publie,
        datePublication: formData.datePublication,
        dateEvenement: formData.dateEvenement || undefined,
        imageUrl: this.uploadedImageUrl || undefined
      };

      if (this.isEditMode && this.actualiteId) {
        this.updateActualite(actualiteData);
      } else {
        this.createActualite(actualiteData);
      }
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez corriger les erreurs du formulaire'
      });
    }
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
          detail: 'Impossible de créer l\'actualité'
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
          detail: 'Impossible de modifier l\'actualité'
        });
        this.submitting = false;
      }
    });
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
      // Logique de prévisualisation
      this.messageService.add({
        severity: 'info',
        summary: 'Prévisualisation',
        detail: 'Fonctionnalité à implémenter'
      });
    }
  }

  saveDraft() {
    const formData = { ...this.actualiteForm.value, publie: false };
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