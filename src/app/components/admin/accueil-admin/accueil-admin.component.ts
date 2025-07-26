import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accueil-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accueil-admin.component.html',
  styleUrl: './accueil-admin.component.css'
})
export class AccueilAdminComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialisation du composant
    console.log('Dashboard Admin initialisé');
  }

  /**
   * Navigation vers une route spécifique
   * @param route - La route vers laquelle naviguer
   */
  navigateTo(route: string): void {
    this.router.navigate([route]).catch(error => {
      console.error('Erreur de navigation:', error);
    });
  }

  /**
   * Actions rapides avec feedback visuel
   */
  onQuickAction(action: string): void {
    console.log(`Action rapide: ${action}`);
    // Ici vous pouvez ajouter une logique spécifique pour chaque action
    switch(action) {
      case 'utilisateurs':
        this.navigateTo('admin/utilisateurs');
        break;
      case 'parametres':
        this.navigateTo('admin/parametres');
        break;
      case 'rapports':
        this.navigateTo('admin/rapports');
        break;
      case 'sauvegarde':
        this.performBackup();
        break;
      default:
        this.navigateTo(`admin/${action}`);
    }
  }

  /**
   * Effectuer une sauvegarde (exemple)
   */
  private performBackup(): void {
    // Logique de sauvegarde
    console.log('Sauvegarde en cours...');
    // Afficher une notification de succès
    setTimeout(() => {
      console.log('Sauvegarde terminée');
    }, 2000);
  }
}