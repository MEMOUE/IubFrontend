import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

// Services et modèles
import { FormationService } from '../../../core/services/formation.service';
import { Formation, CreateFormationDto } from '../../../shared/models/formation.model';

@Component({
  selector: 'app-newformation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    InputNumberModule,
    DropdownModule,
    CheckboxModule,
    CardModule,
    PanelModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './newformation.component.html',
  styleUrl: './newformation.component.css'
})
export class NewformationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  formationForm!: FormGroup;
  loading = false;
  submitted = false;

  // Options pour les dropdowns
  categoriesOptions = [
    { label: 'Licence', value: 'licence' },
    { label: 'Master', value: 'master' }
  ];

  diplomesOptions = [
    { label: 'Licence en Management', value: 'Licence en Management' },
    { label: 'Licence en Informatique', value: 'Licence en Informatique' },
    { label: 'Licence en Comptabilité-Finance', value: 'Licence en Comptabilité-Finance' },
    { label: 'Licence en Communication', value: 'Licence en Communication' },
    { label: 'Master en Management Stratégique', value: 'Master en Management Stratégique' },
    { label: 'Master en Ingénierie Informatique', value: 'Master en Ingénierie Informatique' },
    { label: 'Master en Finance d\'Entreprise', value: 'Master en Finance d\'Entreprise' },
    { label: 'Master en Marketing Digital', value: 'Master en Marketing Digital' }
  ];

  dureeOptions = [
    { label: '1 an', value: '1 an' },
    { label: '2 ans', value: '2 ans' },
    { label: '3 ans', value: '3 ans' },
    { label: '4 ans', value: '4 ans' },
    { label: '5 ans', value: '5 ans' }
  ];

  constructor(
    private fb: FormBuilder,
    private formationService: FormationService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Initialiser le formulaire
  initializeForm() {
    this.formationForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      diplome: ['', Validators.required],
      duree: ['', Validators.required],
      categorie: ['', Validators.required],
      description: [''],
      objectifs: this.fb.array([]),
      debouches: this.fb.array([]),
      fraisScolarite: [null, [Validators.min(0)]],
      conditionsAdmission: [''],
      programmeDetaille: [''],
      nombreSemestres: [null, [Validators.min(1), Validators.max(10)]],
      nombrePlaces: [null, [Validators.required, Validators.min(1)]],
      disponible: [true],
      actif: [true]
    });

    // Ajouter au moins un champ pour les objectifs et débouchés
    this.addObjectif();
    this.addDebouche();
  }

  // Getters pour les FormArrays
  get objectifs(): FormArray {
    return this.formationForm.get('objectifs') as FormArray;
  }

  get debouches(): FormArray {
    return this.formationForm.get('debouches') as FormArray;
  }

  // Ajouter un objectif
  addObjectif() {
    const objectifControl = this.fb.control('', Validators.required);
    this.objectifs.push(objectifControl);
  }

  // Supprimer un objectif
  removeObjectif(index: number) {
    if (this.objectifs.length > 1) {
      this.objectifs.removeAt(index);
    }
  }

  // Ajouter un débouché
  addDebouche() {
    const deboucheControl = this.fb.control('', Validators.required);
    this.debouches.push(deboucheControl);
  }

  // Supprimer un débouché
  removeDebouche(index: number) {
    if (this.debouches.length > 1) {
      this.debouches.removeAt(index);
    }
  }

  // Vérifier si un champ est invalide
  isFieldInvalid(fieldName: string): boolean {
    const field = this.formationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  // Obtenir le message d'erreur pour un champ
  getFieldError(fieldName: string): string {
    const field = this.formationForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${fieldName} est requis`;
    if (field.errors['minlength']) return `${fieldName} doit contenir au moins ${field.errors['minlength'].requiredLength} caractères`;
    if (field.errors['min']) return `${fieldName} doit être supérieur à ${field.errors['min'].min}`;
    if (field.errors['max']) return `${fieldName} doit être inférieur à ${field.errors['max'].max}`;
    
    return 'Champ invalide';
  }

  // Soumettre le formulaire
  onSubmit() {
    this.submitted = true;

    if (this.formationForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulaire invalide',
        detail: 'Veuillez corriger les erreurs dans le formulaire',
        life: 5000
      });
      return;
    }

    this.loading = true;
    
    // Préparer les données
    const formData = this.formationForm.value;
    const createFormationDto: CreateFormationDto = {
      ...formData,
      objectifs: formData.objectifs.filter((obj: string) => obj.trim() !== ''),
      debouches: formData.debouches.filter((deb: string) => deb.trim() !== ''),
      nombreInscrits: 0
    };

    // Envoyer au service
    this.formationService.createFormation(createFormationDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (formation) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Formation créée',
            detail: `La formation "${formation.nom}" a été créée avec succès`,
            life: 5000
          });
          
          // Rediriger vers la liste des formations après un délai
          setTimeout(() => {
            this.router.navigate(['/formations']);
          }, 2000);
        },
        error: (error) => {
          console.error('Erreur lors de la création de la formation:', error);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur de création',
            detail: 'Impossible de créer la formation. Veuillez réessayer.',
            life: 5000
          });
        }
      });
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir réinitialiser le formulaire ? Toutes les données saisies seront perdues.',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.formationForm.reset();
        this.submitted = false;
        
        // Réinitialiser les FormArrays
        while (this.objectifs.length > 1) {
          this.objectifs.removeAt(1);
        }
        while (this.debouches.length > 1) {
          this.debouches.removeAt(1);
        }
        
        // Remettre les valeurs par défaut
        this.formationForm.patchValue({
          disponible: true,
          actif: true
        });
        
        this.messageService.add({
          severity: 'info',
          summary: 'Formulaire réinitialisé',
          detail: 'Le formulaire a été réinitialisé avec succès',
          life: 3000
        });
      }
    });
  }

  // Annuler et retourner à la liste
  cancel() {
    if (this.formationForm.dirty) {
      this.confirmationService.confirm({
        message: 'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.router.navigate(['/formations']);
        }
      });
    } else {
      this.router.navigate(['/formations']);
    }
  }

  // Prévisualiser la formation
  previewFormation() {
    if (this.formationForm.valid) {
      // Implémenter la logique de prévisualisation
      this.messageService.add({
        severity: 'info',
        summary: 'Prévisualisation',
        detail: 'Fonctionnalité de prévisualisation à implémenter',
        life: 3000
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulaire incomplet',
        detail: 'Veuillez remplir tous les champs requis pour prévisualiser',
        life: 3000
      });
    }
  }
}