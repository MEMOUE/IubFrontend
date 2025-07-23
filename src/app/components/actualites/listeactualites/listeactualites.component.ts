import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';

import { MessageService, ConfirmationService } from 'primeng/api';
import { ActualiteService } from '../../../core/services/actualite.service';
import { Actualite } from '../../../shared/models/actualite.model';

@Component({
  selector: 'app-listeactualites',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './listeactualites.component.html',
  styleUrl: './listeactualites.component.css'
})
export class ListeactualitesComponent implements OnInit {

  actualites: Actualite[] = [];
  actualitesFiltrees: Actualite[] = [];
  categories: any[] = [];
  searchKeyword = '';
  selectedCategorie: any = null;
  loading = false;

  // Statistiques
  statistiques = [
    { valeur: '0', label: 'Total actualités' },
    { valeur: '0', label: 'Publiées ce mois' },
    { valeur: '0', label: 'Événements à venir' },
    { valeur: '0', label: 'Vues totales' }
  ];

  constructor(
    private actualiteService: ActualiteService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initializeCategories();
  }

  ngOnInit() {
    this.loadActualites();
  }

  initializeCategories() {
    this.categories = [
      { label: 'Toutes les catégories', value: null },
      { label: 'Événements', value: 'evenement' },
      { label: 'Actualités', value: 'news' },
      { label: 'Cérémonies', value: 'ceremonie' },
      { label: 'Formations', value: 'formation' },
      { label: 'Partenariats', value: 'partenariat' },
      { label: 'Recherche', value: 'recherche' }
    ];
  }

  loadActualites() {
    this.loading = true;
    this.actualiteService.getActualites().subscribe({
      next: (data) => {
        this.actualites = data;
        this.applyFilters();
        this.updateStatistics();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les actualités'
        });
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let filtered = [...this.actualites];

    // Filtrer par catégorie - CORRECTION: utiliser 'categorie' au lieu de 'category'
    if (this.selectedCategorie) {
      filtered = filtered.filter(a => a.categorie === this.selectedCategorie);
    }

    // Filtrer par mot-clé - CORRECTION: utiliser 'titre' au lieu de 'title'
    if (this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.toLowerCase();
      filtered = filtered.filter(a => 
        a.titre.toLowerCase().includes(keyword) ||
        a.description.toLowerCase().includes(keyword)
      );
    }

    this.actualitesFiltrees = filtered;
  }

  onSearch() {
    this.applyFilters();
  }

  onCategorieChange() {
    this.applyFilters();
  }

  updateStatistics() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    this.statistiques = [
      { 
        valeur: this.actualites.length.toString(), 
        label: 'Total actualités' 
      },
      { 
        valeur: this.actualites.filter(a => {
          // CORRECTION: utiliser 'datePublication' au lieu de 'date'
          const date = new Date(a.datePublication);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        }).length.toString(), 
        label: 'Publiées ce mois' 
      },
      { 
        valeur: this.actualites.filter(a => 
          // CORRECTION: utiliser 'datePublication' ou 'dateEvenement' selon le contexte
          new Date(a.dateEvenement || a.datePublication) > now
        ).length.toString(), 
        label: 'Événements à venir' 
      },
      { 
        valeur: this.actualites.reduce((total, a) => total + (a.nombreVues || 0), 0).toString(), 
        label: 'Vues totales' 
      }
    ];
  }

  navigateToNew() {
    this.router.navigate(['/actualites/nouveau']);
  }

  navigateToDetail(id: number) {
    this.router.navigate(['/actualites/details', id]);
  }

  navigateToEdit(id: number) {
    this.router.navigate(['/actualites/modifier', id]);
  }

  confirmDelete(actualite: Actualite) {
    this.confirmationService.confirm({
      // CORRECTION: utiliser 'titre' au lieu de 'title'
      message: `Êtes-vous sûr de vouloir supprimer l'actualité "${actualite.titre}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      accept: () => {
        this.deleteActualite(actualite.id!);
      }
    });
  }

  deleteActualite(id: number) {
    this.actualiteService.deleteActualite(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Actualité supprimée avec succès'
        });
        this.loadActualites();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de supprimer l\'actualité'
        });
      }
    });
  }

  togglePublication(actualite: Actualite) {
    // CORRECTION: utiliser 'publie' au lieu de 'published'
    const updatedActualite = { ...actualite, publie: !actualite.publie };
    
    this.actualiteService.updateActualite(actualite.id!, updatedActualite).subscribe({
      next: () => {
        // CORRECTION: utiliser 'publie' au lieu de 'published'
        const action = updatedActualite.publie ? 'publiée' : 'dépubliée';
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: `Actualité ${action} avec succès`
        });
        this.loadActualites();
      },
      error: (error) => {
        console.error('Erreur lors de la modification:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de modifier le statut'
        });
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getCategorieLabel(categorie: string): string {
    const cat = this.categories.find(c => c.value === categorie);
    return cat ? cat.label : categorie;
  }

  getSeverityForCategory(categorie: string): string {
    const severityMap: { [key: string]: string } = {
      'evenement': 'info',
      'news': 'success',
      'ceremonie': 'warning',
      'formation': 'secondary',
      'partenariat': 'help',
      'recherche': 'contrast'
    };
    return severityMap[categorie] || 'info';
  }
}