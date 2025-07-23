export interface Actualite {
  id?: number;
  titre: string;
  description: string;
  contenu?: string;
  imageUrl?: string;
  datePublication: string;  // Obligatoire selon le backend
  dateEvenement?: string;
  categorie: string;        // Obligatoire selon le backend
  auteur: string;           // Obligatoire selon le backend
  nombreVues?: number;
  publie?: boolean;
  actif?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateActualiteDto {
  titre: string;                    // Obligatoire
  description: string;              // Obligatoire
  contenu?: string;
  imageUrl?: string;
  categorie: string;                // Obligatoire
  datePublication: string;          // Obligatoire
  dateEvenement?: string;
  auteur: string;                   // Obligatoire
  publie?: boolean;
}
