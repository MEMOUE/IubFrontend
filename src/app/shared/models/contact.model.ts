export interface ContactMessage {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  subject: string;
  message: string;
  status?: 'pending' | 'read' | 'replied';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateContactDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  subject: string;
  message: string;
}