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

  // Options pour les dropdowns - Tous les niveaux universitaires
  categoriesOptions = [
    { label: 'BTS/DUT (Bac+2)', value: 'bts_dut' },
    { label: 'Licence (Bac+3)', value: 'licence' },
    { label: 'Licence Professionnelle (Bac+3)', value: 'licence_pro' },
    { label: 'Master (Bac+5)', value: 'master' },
    { label: 'Master Professionnel (Bac+5)', value: 'master_pro' },
    { label: 'MBA', value: 'mba' },
    { label: 'Doctorat (Bac+8)', value: 'doctorat' },
    { label: 'Formation Continue', value: 'formation_continue' },
    { label: 'Certification Professionnelle', value: 'certification' }
  ];

  // Tous les diplômes possibles actuels
  diplomesOptions = [
    // BTS/DUT
    { label: 'BTS Comptabilité et Gestion', value: 'BTS Comptabilité et Gestion' },
    { label: 'BTS Management Commercial Opérationnel', value: 'BTS Management Commercial Opérationnel' },
    { label: 'BTS Services Informatiques aux Organisations', value: 'BTS Services Informatiques aux Organisations' },
    { label: 'BTS Communication', value: 'BTS Communication' },
    { label: 'BTS Banque', value: 'BTS Banque' },
    { label: 'BTS Tourisme', value: 'BTS Tourisme' },
    { label: 'DUT Gestion des Entreprises et des Administrations', value: 'DUT Gestion des Entreprises et des Administrations' },
    { label: 'DUT Informatique', value: 'DUT Informatique' },
    { label: 'DUT Techniques de Commercialisation', value: 'DUT Techniques de Commercialisation' },
    
    // Licences générales
    { label: 'Licence en Management', value: 'Licence en Management' },
    { label: 'Licence en Administration des Affaires', value: 'Licence en Administration des Affaires' },
    { label: 'Licence en Informatique', value: 'Licence en Informatique' },
    { label: 'Licence en Ingénierie Logicielle', value: 'Licence en Ingénierie Logicielle' },
    { label: 'Licence en Comptabilité-Finance', value: 'Licence en Comptabilité-Finance' },
    { label: 'Licence en Finance-Banque', value: 'Licence en Finance-Banque' },
    { label: 'Licence en Communication', value: 'Licence en Communication' },
    { label: 'Licence en Marketing', value: 'Licence en Marketing' },
    { label: 'Licence en Ressources Humaines', value: 'Licence en Ressources Humaines' },
    { label: 'Licence en Commerce International', value: 'Licence en Commerce International' },
    { label: 'Licence en Logistique et Transport', value: 'Licence en Logistique et Transport' },
    { label: 'Licence en Droit des Affaires', value: 'Licence en Droit des Affaires' },
    { label: 'Licence en Économie', value: 'Licence en Économie' },
    { label: 'Licence en Anglais des Affaires', value: 'Licence en Anglais des Affaires' },
    
    // Licences Professionnelles
    { label: 'Licence Pro Management des PME', value: 'Licence Pro Management des PME' },
    { label: 'Licence Pro E-commerce', value: 'Licence Pro E-commerce' },
    { label: 'Licence Pro Développement Web', value: 'Licence Pro Développement Web' },
    { label: 'Licence Pro Cybersécurité', value: 'Licence Pro Cybersécurité' },
    { label: 'Licence Pro Audit et Contrôle de Gestion', value: 'Licence Pro Audit et Contrôle de Gestion' },
    
    // Masters
    { label: 'Master en Management Stratégique', value: 'Master en Management Stratégique' },
    { label: 'Master en Management des Projets', value: 'Master en Management des Projets' },
    { label: 'Master en Ingénierie Informatique', value: 'Master en Ingénierie Informatique' },
    { label: 'Master en Intelligence Artificielle', value: 'Master en Intelligence Artificielle' },
    { label: 'Master en Cybersécurité', value: 'Master en Cybersécurité' },
    { label: 'Master en Data Science', value: 'Master en Data Science' },
    { label: 'Master en Finance d\'Entreprise', value: 'Master en Finance d\'Entreprise' },
    { label: 'Master en Finance de Marché', value: 'Master en Finance de Marché' },
    { label: 'Master en Audit et Contrôle de Gestion', value: 'Master en Audit et Contrôle de Gestion' },
    { label: 'Master en Marketing Digital', value: 'Master en Marketing Digital' },
    { label: 'Master en Communication Digitale', value: 'Master en Communication Digitale' },
    { label: 'Master en Ressources Humaines', value: 'Master en Ressources Humaines' },
    { label: 'Master en Commerce International', value: 'Master en Commerce International' },
    { label: 'Master en Supply Chain Management', value: 'Master en Supply Chain Management' },
    { label: 'Master en Entrepreneuriat et Innovation', value: 'Master en Entrepreneuriat et Innovation' },
    { label: 'Master en Droit des Affaires', value: 'Master en Droit des Affaires' },
    
    // Masters Professionnels
    { label: 'Master Pro Management Hospitalier', value: 'Master Pro Management Hospitalier' },
    { label: 'Master Pro Management Public', value: 'Master Pro Management Public' },
    { label: 'Master Pro Consulting', value: 'Master Pro Consulting' },
    { label: 'Master Pro Banking & Finance', value: 'Master Pro Banking & Finance' },
    
    // MBA
    { label: 'MBA Management Général', value: 'MBA Management Général' },
    { label: 'MBA Finance', value: 'MBA Finance' },
    { label: 'MBA Marketing', value: 'MBA Marketing' },
    { label: 'MBA Digital Business', value: 'MBA Digital Business' },
    { label: 'Executive MBA', value: 'Executive MBA' },
    
    // Doctorats
    { label: 'Doctorat en Sciences de Gestion', value: 'Doctorat en Sciences de Gestion' },
    { label: 'Doctorat en Informatique', value: 'Doctorat en Informatique' },
    { label: 'Doctorat en Économie', value: 'Doctorat en Économie' },
    { label: 'PhD in Business Administration', value: 'PhD in Business Administration' },
    
    // Certifications
    { label: 'Certification PMP', value: 'Certification PMP' },
    { label: 'Certification Scrum Master', value: 'Certification Scrum Master' },
    { label: 'Certification Digital Marketing', value: 'Certification Digital Marketing' },
    { label: 'Certification Data Analytics', value: 'Certification Data Analytics' },
    { label: 'Certification Cloud Computing', value: 'Certification Cloud Computing' }
  ];

  dureeOptions = [
    { label: '6 mois', value: '6 mois' },
    { label: '1 an', value: '1 an' },
    { label: '18 mois', value: '18 mois' },
    { label: '2 ans', value: '2 ans' },
    { label: '3 ans', value: '3 ans' },
    { label: '4 ans', value: '4 ans' },
    { label: '5 ans', value: '5 ans' },
    { label: '6 ans', value: '6 ans' },
    { label: '8 ans', value: '8 ans' }
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

    // Écouter les changements pour debug
    this.formationForm.statusChanges.subscribe(status => {
      console.log('Form status:', status);
      console.log('Form errors:', this.formationForm.errors);
      console.log('Form value:', this.formationForm.value);
    });
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
    const objectifControl = this.fb.control(''); // Pas de validation requise par défaut
    this.objectifs.push(objectifControl);
  }

  // Supprimer un objectif
  removeObjectif(index: number) {
    if (this.objectifs.length > 0) { // Permettre de supprimer même le dernier
      this.objectifs.removeAt(index);
    }
  }

  // Ajouter un débouché
  addDebouche() {
    const deboucheControl = this.fb.control(''); // Pas de validation requise par défaut
    this.debouches.push(deboucheControl);
  }

  // Supprimer un débouché
  removeDebouche(index: number) {
    if (this.debouches.length > 0) { // Permettre de supprimer même le dernier
      this.debouches.removeAt(index);
    }
  }

  // Vérifier si le formulaire peut être soumis
  canSubmit(): boolean {
    // Vérifier les champs requis de base
    const requiredFields = ['nom', 'diplome', 'duree', 'categorie', 'nombrePlaces'];
    const hasRequiredFields = requiredFields.every(field => {
      const control = this.formationForm.get(field);
      return control && control.value && control.valid;
    });

    return hasRequiredFields;
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

    // Vérifier seulement les champs essentiels
    if (!this.canSubmit()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Champs requis manquants',
        detail: 'Veuillez remplir tous les champs obligatoires: nom, diplôme, durée, catégorie et nombre de places',
        life: 5000
      });
      return;
    }

    this.loading = true;
    
    // Préparer les données
    const formData = this.formationForm.value;
    const createFormationDto: CreateFormationDto = {
      ...formData,
      objectifs: formData.objectifs.filter((obj: string) => obj && obj.trim() !== ''),
      debouches: formData.debouches.filter((deb: string) => deb && deb.trim() !== ''),
      nombreInscrits: 0
    };

    console.log('Données à envoyer:', createFormationDto);

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
            detail: error.message || 'Impossible de créer la formation. Veuillez réessayer.',
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
        this.objectifs.clear();
        this.debouches.clear();
        
        // Ajouter au moins un champ vide pour chaque
        this.addObjectif();
        this.addDebouche();
        
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