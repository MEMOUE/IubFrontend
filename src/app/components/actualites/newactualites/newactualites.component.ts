import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
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
  
  // Preview
  imagePreview: string | null = null;
  selectedFile: File | null = null;

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
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      content: ['', [Validators.minLength(50)]],
      category: ['', Validators.required],
      published: [false],
      date: [new Date(), Validators.required]
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
      title: actualite.title,
      description: actualite.description,
      content: actualite.content || '',
      category: actualite.category,
      published: actualite.published,
      date: new Date(actualite.date)
    });

    // Charger l'image existante
    if (actualite.image) {
      this.imagePreview = actualite.image;
    }
  }

  onSubmit() {
    if (this.actualiteForm.valid) {
      this.submitting = true;

      const formData = this.actualiteForm.value;
      const actualiteData: CreateActualiteDto = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        published: formData.published,
        image: this.imagePreview || 'assets/images/default-news.jpg'
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

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      this.messageService.add({
        severity: 'info',
        summary: 'Image sélectionnée',
        detail: `${file.name} - ${this.formatFileSize(file.size)}`
      });
    }
  }

  onFileRemove() {
    this.selectedFile = null;
    this.imagePreview = null;
    
    this.messageService.add({
      severity: 'info',
      summary: 'Image supprimée',
      detail: 'L\'image a été supprimée'
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
    const formData = { ...this.actualiteForm.value, published: false };
    this.actualiteForm.patchValue({ published: false });
    this.onSubmit();
  }

  // Getters pour faciliter l'accès aux contrôles du formulaire
  get titleCharCount(): number {
    return this.actualiteForm.get('title')?.value?.length || 0;
  }

  get descriptionCharCount(): number {
    return this.actualiteForm.get('description')?.value?.length || 0;
  }

  get contentCharCount(): number {
    return this.actualiteForm.get('content')?.value?.length || 0;
  }

  getCharCountColor(count: number, max: number): string {
    const ratio = count / max;
    if (ratio > 0.9) return '#dc3545';
    if (ratio > 0.7) return '#fd7e14';
    return '#28a745';
  }
}