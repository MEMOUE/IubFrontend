// src/app/shared/models/directeur.model.ts

export interface Directeur {
  id?: number;
  nom: string;
  titre: string;
  photoUrl?: string;
  experience?: string;
  diplomes?: string[];
  messageBienvenue?: string;
  messageVision?: string;
  messageEngagements?: string;
  messageEtudiants?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  linkedinUrl?: string;
  actif?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DirecteurStatus {
  existeDirecteurActif: boolean;
  nombreTotalDirecteurs: number;
  nombreDirecteursActifs: number;
}

export interface MessageSection {
  titre: string;
  contenu: string;
}

export interface DirecteurCreateResponse {
  message?: string;
  directeurActuel?: Directeur;
  warning?: boolean;
  error?: string;
}

// Types utilitaires
export type DirecteurFormData = Omit<Directeur, 'id' | 'createdAt' | 'updatedAt'>;
export type DirecteurUpdateData = Partial<DirecteurFormData>;