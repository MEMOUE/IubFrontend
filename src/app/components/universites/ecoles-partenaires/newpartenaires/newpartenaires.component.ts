import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Services et modèles
import { PartenaireService } from '../../../../core/services/partenaire.service';
import { EcolePartenaire } from '../../../../shared/models/partenaire.model';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-newpartenaires',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    DropdownModule,
    ChipsModule,
    CheckboxModule,
    ToastModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './newpartenaires.component.html',
  styleUrl: './newpartenaires.component.css'
})
export class NewpartenairesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Form et état
  partenaireForm!: FormGroup;
  loading = false;
  isEditMode = false;
  partenaireId: number | null = null;
  
  // Options pour les dropdowns
  regions: DropdownOption[] = [
    { label: 'Europe', value: 'europe' },
    { label: 'Amérique', value: 'amerique' },
    { label: 'Afrique', value: 'afrique' }
  ];
  
  typesEtablissement: DropdownOption[] = [
    { label: 'Université publique', value: 'Université publique' },
    { label: 'Université privée', value: 'Université privée' },
    { label: 'École de commerce', value: 'École de commerce' },
    { label: 'École d\'ingénieur', value: 'École d\'ingénieur' },
    { label: 'Institut spécialisé', value: 'Institut spécialisé' },
    { label: 'École supérieure', value: 'École supérieure' },
    { label: 'Centre de formation', value: 'Centre de formation' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private partenaireService: PartenaireService,
    private messageService: MessageService
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    // Vérifier si on est en mode édition
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.partenaireId = +params['id'];
        this.chargerPartenaire(this.partenaireId);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialise le formulaire
   */
  private initializeForm() {
    this.partenaireForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      pays: ['', [Validators.required]],
      ville: ['', [Validators.required]],
      type: ['', [Validators.required]],
      region: ['', [Validators.required]],
      description: [''],
      dureePartenariat: [''],
      siteWeb: ['', [this.urlValidator]],
      emailContact: ['', [Validators.email]],
      domaines: this.fb.array([]),
      programmes: this.fb.array([]),
      avantages: this.fb.array([]),
      actif: [true]
    });
  }

  /**
   * Charge les données d'un partenaire existant
   */
  private chargerPartenaire(id: number) {
    this.loading = true;
    
    this.partenaireService.getEcolePartenaireById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (partenaire: EcolePartenaire) => {
          this.remplirFormulaire(partenaire);
          this.loading = false;
        },
        error: (error: Error) => {
          console.error('Erreur lors du chargement du partenaire:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les données du partenaire'
          });
          this.router.navigate(['/universites/ecoles-partenaires']);
          this.loading = false;
        }
      });
  }

  /**
   * Remplit le formulaire avec les données du partenaire
   */
  private remplirFormulaire(partenaire: EcolePartenaire) {
    this.partenaireForm.patchValue({
      nom: partenaire.nom,
      pays: partenaire.pays,
      ville: partenaire.ville,
      type: partenaire.type,
      region: partenaire.region,
      description: partenaire.description,
      dureePartenariat: partenaire.dureePartenariat,
      siteWeb: partenaire.siteWeb,
      emailContact: partenaire.emailContact,
      actif: partenaire.actif
    });

    // Remplir les arrays
    this.setFormArray('domaines', partenaire.domaines || []);
    this.setFormArray('programmes', partenaire.programmes || []);
    this.setFormArray('avantages', partenaire.avantages || []);
  }

  /**
   * Configure un FormArray avec des valeurs
   */
  private setFormArray(fieldName: string, values: string[]) {
    const formArray = this.partenaireForm.get(fieldName) as FormArray;
    formArray.clear();
    values.forEach(value => {
      formArray.push(this.fb.control(value));
    });
  }

  /**
   * Getters pour les FormArrays
   */
  get domainesArray(): FormArray {
    return this.partenaireForm.get('domaines') as FormArray;
  }

  get programmesArray(): FormArray {
    return this.partenaireForm.get('programmes') as FormArray;
  }

  get avantagesArray(): FormArray {
    return this.partenaireForm.get('avantages') as FormArray;
  }

  /**
   * Ajoute un élément à un FormArray
   */
  ajouterElement(fieldName: string) {
    const formArray = this.partenaireForm.get(fieldName) as FormArray;
    formArray.push(this.fb.control('', [Validators.required]));
  }

  /**
   * Supprime un élément d'un FormArray
   */
  supprimerElement(fieldName: string, index: number) {
    const formArray = this.partenaireForm.get(fieldName) as FormArray;
    formArray.removeAt(index);
  }

  /**
   * Valide une URL
   */
  private urlValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;
    
    try {
      new URL(control.value);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  }

  /**
   * Vérifie si un champ a une erreur
   */
  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.partenaireForm.get(fieldName);
    if (!field) return false;
    
    if (errorType) {
      return field.hasError(errorType) && (field.dirty || field.touched);
    }
    return field.invalid && (field.dirty || field.touched);
  }

  /**
   * Obtient le message d'erreur pour un champ
   */
  getErrorMessage(fieldName: string): string {
    const field = this.partenaireForm.get(fieldName);
    if (!field?.errors) return '';

    if (field.hasError('required')) return 'Ce champ est obligatoire';
    if (field.hasError('minlength')) return 'Trop court';
    if (field.hasError('email')) return 'Email invalide';
    if (field.hasError('invalidUrl')) return 'URL invalide';

    return 'Champ invalide';
  }

  /**
   * Sauvegarde le partenaire
   */
  sauvegarder() {
    if (this.partenaireForm.invalid) {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }

    const formData = this.partenaireForm.value;
    
    // Nettoyer les arrays
    formData.domaines = formData.domaines.filter((d: string) => d.trim());
    formData.programmes = formData.programmes.filter((p: string) => p.trim());
    formData.avantages = formData.avantages.filter((a: string) => a.trim());

    // Valider avec le service
    const errors = this.partenaireService.validateEcolePartenaire(formData);
    if (errors.length > 0) {
      errors.forEach((error: string) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur de validation',
          detail: error
        });
      });
      return;
    }

    this.loading = true;

    const operation = this.isEditMode
      ? this.partenaireService.updateEcolePartenaire(this.partenaireId!, formData)
      : this.partenaireService.createEcolePartenaire(formData);

    operation.pipe(takeUntil(this.destroy$)).subscribe({
      next: (partenaire: EcolePartenaire) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: `École partenaire ${this.isEditMode ? 'modifiée' : 'créée'} avec succès`
        });
        
        setTimeout(() => {
          this.router.navigate(['/universites/ecoles-partenaires']);
        }, 1500);
      },
      error: (error: Error) => {
        console.error('Erreur lors de la sauvegarde:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: `Impossible de ${this.isEditMode ? 'modifier' : 'créer'} l'école partenaire`
        });
        this.loading = false;
      }
    });
  }

  /**
   * Marque tous les champs comme touchés
   */
  private markFormGroupTouched() {
    Object.keys(this.partenaireForm.controls).forEach(key => {
      const control = this.partenaireForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach((arrayControl: AbstractControl) => {
          arrayControl.markAsTouched();
        });
      }
    });
  }

  /**
   * Annule et retourne à la liste
   */
  annuler() {
    this.router.navigate(['/universites/ecoles-partenaires']);
  }

  /**
   * Réinitialise le formulaire
   */
  reinitialiser() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ?')) {
      if (this.isEditMode && this.partenaireId) {
        this.chargerPartenaire(this.partenaireId);
      } else {
        this.partenaireForm.reset();
        this.initializeForm();
      }
    }
  }

  /**
   * Gère la soumission du formulaire
   */
  onSubmit() {
    this.sauvegarder();
  }
}