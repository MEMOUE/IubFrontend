import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { ChipsModule } from 'primeng/chips';

// Services and models
import { PartenaireService } from '../../../../core/services/partenaire.service';
import { EntreprisePartenaire } from '../../../../shared/models/partenaire.model';

@Component({
  selector: 'app-new-entreprise-partenaires',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    DropdownModule,
    MultiSelectModule,
    ToastModule,
    ProgressSpinnerModule,
    CardModule,
    ChipsModule
  ],
  providers: [MessageService],
  templateUrl: './new-entreprise-partenaires.component.html',
  styleUrl: './new-entreprise-partenaires.component.css'
})
export class NewEntreprisePartenairesComponent implements OnInit {

  entrepriseForm: FormGroup;
  loading = false;
  isEditMode = false;
  entrepriseId: number | null = null;

  // Options pour les dropdowns
  secteurOptions = [
    { label: 'Télécommunications', value: 'Télécommunications' },
    { label: 'Banque et Finance', value: 'Banque et Finance' },
    { label: 'Technologies', value: 'Technologies' },
    { label: 'Industrie Agroalimentaire', value: 'Industrie Agroalimentaire' },
    { label: 'Éducation', value: 'Éducation' },
    { label: 'Santé', value: 'Santé' },
    { label: 'Transport et Logistique', value: 'Transport et Logistique' },
    { label: 'Commerce et Distribution', value: 'Commerce et Distribution' }
  ];

  tailleOptions = [
    { label: 'PME', value: 'PME' },
    { label: 'Grande entreprise', value: 'Grande entreprise' },
    { label: 'Start-up', value: 'Start-up' },
    { label: 'Multinationale', value: 'Multinationale' }
  ];

  typePartenaireOptions = [
    { label: 'Partenariat stratégique', value: 'Partenariat stratégique' },
    { label: 'Partenariat académique', value: 'Partenariat académique' },
    { label: 'Partenariat formation', value: 'Partenariat formation' },
    { label: 'Partenariat emploi', value: 'Partenariat emploi' },
    { label: 'Partenariat innovation', value: 'Partenariat innovation' },
    { label: 'Partenariat local', value: 'Partenariat local' },
    { label: 'Partenariat secteur', value: 'Partenariat secteur' },
    { label: 'Partenariat multinational', value: 'Partenariat multinational' }
  ];

  collaborationOptions = [
    { label: 'Stages', value: 'Stages' },
    { label: 'Emplois', value: 'Emplois' },
    { label: 'Projets étudiants', value: 'Projets étudiants' },
    { label: 'Formations', value: 'Formations' },
    { label: 'Conférences', value: 'Conférences' },
    { label: 'Hackathons', value: 'Hackathons' },
    { label: 'Mentoring', value: 'Mentoring' },
    { label: 'Recherche', value: 'Recherche' },
    { label: 'Graduate program', value: 'Graduate program' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private partenaireService: PartenaireService,
    private messageService: MessageService
  ) {
    this.entrepriseForm = this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.entrepriseId = +params['id'];
        this.isEditMode = true;
        this.chargerEntreprise();
      }
    });
  }

  // Créer le formulaire
  createForm(): FormGroup {
    return this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      secteur: ['', Validators.required],
      taille: ['', Validators.required],
      localisation: ['', Validators.required],
      typePartenariat: [''],
      description: ['', [Validators.maxLength(1000)]],
      collaborations: [[]],
      postes: [[]],
      avantages: [[]],
      dureePartenariat: [''],
      siteWeb: [''],
      emailContact: ['', [Validators.email]],
      responsableContact: ['']
    });
  }

  // Charger les données de l'entreprise en mode édition
  chargerEntreprise() {
    if (!this.entrepriseId) return;

    this.loading = true;
    this.partenaireService.getEntreprisePartenaireById(this.entrepriseId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (entreprise) => {
          this.entrepriseForm.patchValue({
            nom: entreprise.nom,
            secteur: entreprise.secteur,
            taille: entreprise.taille,
            localisation: entreprise.localisation,
            typePartenariat: entreprise.typePartenariat,
            description: entreprise.description,
            collaborations: entreprise.collaborations || [],
            postes: entreprise.postes || [],
            avantages: entreprise.avantages || [],
            dureePartenariat: entreprise.dureePartenariat,
            siteWeb: entreprise.siteWeb,
            emailContact: entreprise.emailContact,
            responsableContact: entreprise.responsableContact
          });
        },
        error: (error) => {
          console.error('Erreur lors du chargement de l\'entreprise:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les données de l\'entreprise'
          });
          this.router.navigate(['/universite/entreprises-partenaires']);
        }
      });
  }

  // Soumettre le formulaire
  onSubmit() {
    if (this.entrepriseForm.valid) {
      this.loading = true;

      const entrepriseData: Partial<EntreprisePartenaire> = {
        ...this.entrepriseForm.value,
        actif: true
      };

      const request$ = this.isEditMode && this.entrepriseId
        ? this.partenaireService.updateEntreprisePartenaire(this.entrepriseId, entrepriseData)
        : this.partenaireService.createEntreprisePartenaire(entrepriseData);

      request$
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (entreprise) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: this.isEditMode 
                ? 'Entreprise modifiée avec succès' 
                : 'Entreprise créée avec succès'
            });
            
            setTimeout(() => {
              this.router.navigate(['/universite/entreprises-partenaires/details', entreprise.id]);
            }, 1000);
          },
          error: (error) => {
            console.error('Erreur lors de la sauvegarde:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible de sauvegarder l\'entreprise'
            });
          }
        });
    } else {
      this.markFormGroupTouched(this.entrepriseForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
    }
  }

  // Marquer tous les champs comme touchés
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Annuler et retourner
  annuler() {
    if (this.isEditMode && this.entrepriseId) {
      this.router.navigate(['/universite/entreprises-partenaires/details', this.entrepriseId]);
    } else {
      this.router.navigate(['/universite/entreprises-partenaires']);
    }
  }

  // Vérifier si un champ a une erreur
  hasError(fieldName: string): boolean {
    const field = this.entrepriseForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Obtenir le message d'erreur pour un champ
  getErrorMessage(fieldName: string): string {
    const field = this.entrepriseForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `Le champ ${fieldName} est obligatoire`;
      }
      if (field.errors['minlength']) {
        return `Le champ ${fieldName} doit contenir au moins ${field.errors['minlength'].requiredLength} caractères`;
      }
      if (field.errors['maxlength']) {
        return `Le champ ${fieldName} ne peut pas dépasser ${field.errors['maxlength'].requiredLength} caractères`;
      }
      if (field.errors['email']) {
        return 'Format d\'email invalide';
      }
    }
    return '';
  }

  // Obtenir le titre de la page
  getPageTitle(): string {
    return this.isEditMode ? 'Modifier l\'entreprise partenaire' : 'Ajouter une entreprise partenaire';
  }

  // Obtenir le texte du bouton de soumission
  getSubmitButtonText(): string {
    return this.isEditMode ? 'Modifier' : 'Créer';
  }
}