import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { LoadingService } from '../../core/services/loading.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div *ngIf="isLoading$ | async" class="loading-overlay">
      <div class="loading-container">
        <p-progressSpinner 
          styleClass="custom-spinner"
          strokeWidth="4"
          animationDuration="1s">
        </p-progressSpinner>
        <p class="loading-text">Chargement...</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .loading-text {
      color: white;
      font-size: 1.2rem;
      font-weight: 500;
    }

    :host ::ng-deep .custom-spinner svg {
      width: 50px;
      height: 50px;
    }

    :host ::ng-deep .custom-spinner .p-progress-spinner-circle {
      stroke: #B85450;
    }
  `]
})
export class LoadingComponent {
  isLoading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.loading$;
  }
}
