import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { MessageService, ConfirmationService } from 'primeng/api';
import { ActualiteService } from '../../../core/services/actualite.service';
import { Actualite } from '../../../shared/models/actualite.model';

@Component({
  selector: 'app-detail-actualite',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    DividerModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './detail-actualite.component.html',
  styleUrl: './detail-actualite.component.css'
})
export class DetailActualiteComponent implements OnInit {

  actualite: Actualite | null = null;
  actualitesSimilaires: Actualite[] = [];
  loading = false;
  actualiteId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actualiteService: ActualiteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.actualiteId = Number(id);
        this.loadActualite();
      }
    });
  }

  loadActualite() {
    if (!this.actualiteId) return;

    this.loading = true;
    this.actualiteService.getActualiteById(this.actualiteId).subscribe({
      next: (actualite) => {
        this.actualite = actualite;
        this.loadActualitesSimilaires();
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

  loadActualitesSimilaires() {
    if (!this.actualite) return;

    // Charger les actualités de la même catégorie
    this.actualiteService.getActualites().subscribe({
      next: (actualites) => {
        this.actualitesSimilaires = actualites
          .filter(a => 
            a.id !== this.actualite!.id && 
            a.category === this.actualite!.category &&
            a.published
          )
          .slice(0, 3); // Limiter à 3 actualités similaires
      },
      error: (error) => {
        console.error('Erreur lors du chargement des actualités similaires:', error);
      }
    });
  }

  navigateToEdit() {
    this.router.navigate(['/actualites/modifier', this.actualiteId]);
  }

  confirmDelete() {
    if (!this.actualite) return;

    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer l'actualité "${this.actualite.title}" ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      accept: () => {
        this.deleteActualite();
      }
    });
  }

  deleteActualite() {
    if (!this.actualiteId) return;

    this.actualiteService.deleteActualite(this.actualiteId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Actualité supprimée avec succès'
        });
        this.router.navigate(['/actualites']);
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

  togglePublication() {
    if (!this.actualite) return;

    const updatedActualite = { ...this.actualite, published: !this.actualite.published };
    
    this.actualiteService.updateActualite(this.actualite.id!, updatedActualite).subscribe({
      next: (actualite) => {
        this.actualite = actualite;
        const action = actualite.published ? 'publiée' : 'dépubliée';
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: `Actualité ${action} avec succès`
        });
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

  navigateToList() {
    this.router.navigate(['/actualites']);
  }

  navigateToActualite(id: number) {
    this.router.navigate(['/actualites/details', id]);
  }

  shareActualite() {
    if (!this.actualite) return;

    if (navigator.share) {
      navigator.share({
        title: this.actualite.title,
        text: this.actualite.description,
        url: window.location.href
      });
    } else {
      // Fallback - copier le lien
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Lien copié',
          detail: 'Le lien de l\'actualité a été copié'
        });
      });
    }
  }

  printActualite() {
    window.print();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCategorieLabel(category: string): string {
    const categories: { [key: string]: string } = {
      'evenement': 'Événement',
      'news': 'Actualité',
      'ceremonie': 'Cérémonie',
      'formation': 'Formation',
      'partenariat': 'Partenariat',
      'recherche': 'Recherche'
    };
    return categories[category] || category;
  }

  getSeverityForCategory(category: string): string {
    const severityMap: { [key: string]: string } = {
      'evenement': 'info',
      'news': 'success',
      'ceremonie': 'warning',
      'formation': 'secondary',
      'partenariat': 'help',
      'recherche': 'contrast'
    };
    return severityMap[category] || 'info';
  }

  isEventUpcoming(): boolean {
    if (!this.actualite || this.actualite.category !== 'evenement') return false;
    
    const eventDate = new Date(this.actualite.date);
    const now = new Date();
    
    return eventDate > now;
  }

  isEventToday(): boolean {
    if (!this.actualite || this.actualite.category !== 'evenement') return false;
    
    const eventDate = new Date(this.actualite.date);
    const today = new Date();
    
    return eventDate.toDateString() === today.toDateString();
  }

  getEventStatus(): { label: string, severity: string } {
    if (this.isEventToday()) {
      return { label: 'Aujourd\'hui', severity: 'danger' };
    } else if (this.isEventUpcoming()) {
      return { label: 'À venir', severity: 'info' };
    } else {
      return { label: 'Passé', severity: 'secondary' };
    }
  }
}