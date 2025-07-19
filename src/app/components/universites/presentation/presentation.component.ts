import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeFaces imports
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-presentation',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './presentation.component.html',
  styleUrl: './presentation.component.css'
})
export class PresentationComponent implements OnInit {

  // Statistiques principales
  stats = [
    { value: '2000+', label: 'Étudiants' },
    { value: '15+', label: 'Formations' },
    { value: '50+', label: 'Enseignants' },
    { value: '95%', label: 'Taux de réussite' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  navigateToFormations() {
    this.router.navigate(['/formations']);
  }

  navigateToContact() {
    this.router.navigate(['/contacts']);
  }
}