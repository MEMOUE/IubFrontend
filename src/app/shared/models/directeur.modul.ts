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

export interface DirecteurConflictResponse {
  message?: string;
  directeurActuel?: Directeur;
  warning?: boolean;
  error?: string;
}

// Types utilitaires
export type DirecteurFormData = Omit<Directeur, 'id' | 'createdAt' | 'updatedAt'>;
export type DirecteurUpdateData = Partial<DirecteurFormData>;

// Enum pour les types de messages
export enum MessageType {
  BIENVENUE = 'messageBienvenue',
  VISION = 'messageVision',
  ENGAGEMENTS = 'messageEngagements',
  ETUDIANTS = 'messageEtudiants'
}

// Interface pour la validation
export interface DirecteurValidation {
  isValid: boolean;
  errors: {
    nom?: string;
    titre?: string;
    email?: string;
    diplomes?: string;
    messages?: string;
  };
}

// Classe utilitaire pour la validation
export class DirecteurValidator {
  static validate(directeur: Partial<Directeur>): DirecteurValidation {
    const errors: DirecteurValidation['errors'] = {};
    let isValid = true;

    // Validation nom
    if (!directeur.nom || directeur.nom.trim().length < 2) {
      errors.nom = 'Le nom doit contenir au moins 2 caractères';
      isValid = false;
    }

    // Validation titre
    if (!directeur.titre || directeur.titre.trim().length < 5) {
      errors.titre = 'Le titre doit contenir au moins 5 caractères';
      isValid = false;
    }

    // Validation email
    if (directeur.email && !this.isValidEmail(directeur.email)) {
      errors.email = 'Format d\'email invalide';
      isValid = false;
    }

    // Validation diplômes
    if (directeur.diplomes && directeur.diplomes.some(d => !d.trim())) {
      errors.diplomes = 'Les diplômes ne peuvent pas être vides';
      isValid = false;
    }

    // Validation messages (longueur maximale)
    const maxMessageLength = 2000;
    const messages = [
      directeur.messageBienvenue,
      directeur.messageVision,
      directeur.messageEngagements,
      directeur.messageEtudiants
    ];

    if (messages.some(msg => msg && msg.length > maxMessageLength)) {
      errors.messages = `Les messages ne peuvent pas dépasser ${maxMessageLength} caractères`;
      isValid = false;
    }

    return { isValid, errors };
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Interface pour les statistiques du directeur
export interface DirecteurStats {
  nombreConnexions?: number;
  derniereConnexion?: string;
  nombreVuesPage?: number;
  dureePoste?: string;
}

// Configuration par défaut
export const DEFAULT_DIRECTEUR_CONFIG = {
  photoUrl: 'assets/images/default-director.jpg',
  actif: true,
  messages: {
    bienvenue: 'Bienvenue à l\'International University of Bouake',
    vision: 'Notre vision est de former les leaders de demain',
    engagements: 'Nous nous engageons à offrir une éducation de qualité',
    etudiants: 'Chers étudiants, vous êtes notre priorité'
  }
};