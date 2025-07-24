export interface Formation {
  id: number;
  nom: string;
  diplome: string;
  duree: string;
  categorie: string; // 'licence' ou 'master'
  description?: string;
  objectifs?: string[];
  debouches?: string[];
  fraisScolarite?: number;
  conditionsAdmission?: string;
  programmeDetaille?: string;
  nombreSemestres?: number;
  nombrePlaces?: number;
  nombreInscrits?: number;
  disponible?: boolean;
  actif?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFormationDto {
  nom: string;
  diplome: string;
  duree: string;
  categorie: string;
  description?: string;
  objectifs?: string[];
  debouches?: string[];
  fraisScolarite?: number;
  conditionsAdmission?: string;
  programmeDetaille?: string;
  nombreSemestres?: number;
  nombrePlaces?: number;
  nombreInscrits?: number;
  disponible?: boolean;
  actif?: boolean;
}

export interface FormationStats {
  totalFormations: number;
  formationsLicence: number;
  formationsMaster: number;
  tauxInsertion: number;
}