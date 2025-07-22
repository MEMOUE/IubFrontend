import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ContactMessage, CreateContactDto } from '../../shared/models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly endpoint = 'contacts';

  constructor(private apiService: ApiService) {}

  sendMessage(message: CreateContactDto): Observable<ContactMessage> {
    return this.apiService.post<ContactMessage>(this.endpoint, message);
  }

  getMessages(): Observable<ContactMessage[]> {
    return this.apiService.get<ContactMessage[]>(this.endpoint);
  }

  getMessageById(id: number): Observable<ContactMessage> {
    return this.apiService.get<ContactMessage>(`${this.endpoint}/${id}`);
  }

  markAsRead(id: number): Observable<ContactMessage> {
    return this.apiService.put<ContactMessage>(`${this.endpoint}/${id}/read`, {});
  }

  replyToMessage(id: number, reply: string): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/${id}/reply`, { reply });
  }
}