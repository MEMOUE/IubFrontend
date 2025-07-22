export interface EcolePartenaire {
  id: number;
  nom: string;
  pays: string;
  ville: string;
  type: string;
  domaines: string[];
  programmes: string[];
  dureePartenariat: string;
  description: string;
  avantages: string[];
  region: 'europe' | 'amerique' | 'afrique';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EntreprisePartenaire {
  id: number;
  nom: string;
  secteur: string;
  taille: string;
  localisation: string;
  typePartenariat: string;
  collaborations: string[];
  dureePartenariat: string;
  description: string;
  avantages: string[];
  postes: string[];
  createdAt?: Date;
  updatedAt?: Date;
}