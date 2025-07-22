import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Statistics } from '../../shared/models/statistics.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  constructor(private apiService: ApiService) {}

  getStatistics(): Observable<Statistics> {
    return this.apiService.get<Statistics>('statistics');
  }

  getFormationStatistics(): Observable<any> {
    return this.apiService.get<any>('statistics/formations');
  }

  getPartenaireStatistics(): Observable<any> {
    return this.apiService.get<any>('statistics/partenaires');
  }

  getContactStatistics(): Observable<any> {
    return this.apiService.get<any>('statistics/contacts');
  }
}