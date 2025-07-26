import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';

// Services
import { DirecteurService, Directeur } from '../../../../core/services/directeur.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-newdirecteur',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    FileUploadModule,
    MessageModule,
    MessagesModule,
    ProgressSpinnerModule,
    DividerModule,
    ConfirmDialogModule,
    DialogModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './newdirecteur.component.html',
  styleUrl: './newdirecteur.component.css'
})
export class NewdirecteurComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  directeurForm: FormGroup;
  loading = false;
  uploadUrl = `${environment.apiUrl}/upload/directeur/photo`;
  photoPreview: string | null = null;
  isEditMode = false;
  currentDirecteur: Directeur | null = null;
  showConflictDialog = false;
  conflictDirecteur: Directeur | null = null;

  constructor(
    private fb: FormBuilder,
    private directeurService: DirecteurService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.directeurForm = this.createForm();
  }

  ngOnInit() {
    this.checkExistingDirecteur();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      titre: ['', [Validators.required, Validators.minLength(5)]],
      photoUrl: [''],
      experience: [''],
      diplomes: this.fb.array([]),
      messageBienvenue: ['', [Validators.maxLength(2000)]],
      messageVision: ['', [Validators.maxLength(2000)]],
      messageEngagements: ['', [Validators.maxLength(2000)]],
      messageEtudiants: ['', [Validators.maxLength(2000)]],
      email: ['', [Validators.email]],
      telephone: [''],
      adresse: ['', [Validators.maxLength(500)]],
      linkedinUrl: ['']
    });
  }

  get diplomesArray(): FormArray {
    return this.directeurForm.get('diplomes') as FormArray;
  }

  private checkExistingDirecteur() {
    this.loading = true;
    this.directeurService.getCurrentDirecteur()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (directeur) => {
          if (directeur) {
            this.currentDirecteur = directeur;
            this.isEditMode = true;
            this.loadDirecteurData(directeur);
          }
          this.loading = false;
        },
        error: (error) => {
          console.log('Aucun directeur actuel trouvé');
          this.loading = false;
        }
      });
  }

  private loadDirecteurData(directeur: Directeur) {
    this.directeurForm.patchValue({
      nom: directeur.nom,
      titre: directeur.titre,
      photoUrl: directeur.photoUrl,
      experience: directeur.experience,
      messageBienvenue: directeur.messageBienvenue,
      messageVision: directeur.messageVision,
      messageEngagements: directeur.messageEngagements,
      messageEtudiants: directeur.messageEtudiants,
      email: directeur.email,
      telephone: directeur.telephone,
      adresse: directeur.adresse,
      linkedinUrl: directeur.linkedinUrl
    });

    // Charger les diplômes
    this.diplomesArray.clear();
    if (directeur.diplomes) {
      directeur.diplomes.forEach(diplome => {
        this.diplomesArray.push(this.fb.control(diplome, Validators.required));
      });
    }

    // Charger la photo
    if (directeur.photoUrl) {
      this.photoPreview = directeur.photoUrl;
    }
  }

  addDiplome() {
    this.diplomesArray.push(this.fb.control('', Validators.required));
  }

  removeDiplome(index: number) {
    this.diplomesArray.removeAt(index);
  }

  onFileUpload(event: any) {
    const response = event.originalEvent.body;
    if (response && response.url) {
      this.directeurForm.patchValue({ photoUrl: response.url });
      this.photoPreview = response.url;
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Photo uploadée avec succès'
      });
    }
  }

  onFileError(event: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Erreur lors de l\'upload de la photo'
    });
  }

  onSubmit() {
    if (this.directeurForm.valid) {
      const formData = this.directeurForm.value;
      
      // Nettoyer les diplômes vides
      formData.diplomes = formData.diplomes.filter((d: string) => d.trim());

      this.loading = true;

      if (this.isEditMode && this.currentDirecteur) {
        // Mode modification
        this.updateDirecteur(formData);
      } else {
        // Mode création
        this.createDirecteur(formData);
      }
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
    }
  }

  private createDirecteur(formData: any) {
    this.directeurService.createDirecteur(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Directeur créé avec succès'
          });
          this.router.navigate(['/universite/directeur']);
        },
        error: (error) => {
          this.loading = false;
          
          // Vérifier si c'est un conflit (directeur déjà existant)
          if (error.status === 409) {
            this.handleConflictError(error.error);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création du directeur'
            });
          }
        }
      });
  }

  private updateDirecteur(formData: any) {
    if (!this.currentDirecteur?.id) return;

    this.directeurService.updateDirecteur(this.currentDirecteur.id, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Directeur mis à jour avec succès'
          });
          this.router.navigate(['/universite/directeur']);
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la mise à jour du directeur'
          });
        }
      });
  }

  private handleConflictError(errorResponse: any) {
    if (errorResponse.directeurActuel) {
      this.conflictDirecteur = errorResponse.directeurActuel;
      this.showConflictDialog = true;
    }
  }

  forceCreateDirecteur() {
    if (this.directeurForm.valid) {
      const formData = this.directeurForm.value;
      formData.diplomes = formData.diplomes.filter((d: string) => d.trim());

      this.loading = true;
      this.showConflictDialog = false;

      // Utiliser l'endpoint force pour créer malgré l'existence d'un autre directeur
      this.directeurService.forceCreateDirecteur(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Directeur remplacé avec succès'
            });
            this.router.navigate(['/universite/directeur']);
          },
          error: (error) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors du remplacement du directeur'
            });
          }
        });
    }
  }

  cancelConflict() {
    this.showConflictDialog = false;
  }

  private markFormGroupTouched() {
    Object.keys(this.directeurForm.controls).forEach(key => {
      const control = this.directeurForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.directeurForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.directeurForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} est requis`;
      if (field.errors['minlength']) return `${fieldName} trop court`;
      if (field.errors['maxlength']) return `${fieldName} trop long`;
      if (field.errors['email']) return 'Email invalide';
    }
    return '';
  }

  cancel() {
    this.router.navigate(['/universite/directeur']);
  }
}