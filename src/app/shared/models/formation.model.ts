export interface Formation {
  id: number;
  nom: string;
  diplome: string;
  duree: string;
  categorie: 'bts_dut' | 'licence' | 'licence_pro' | 'master' | 'master_pro' | 'mba' | 'doctorat' | 'formation_continue' | 'certification'; // Toutes les catégories
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
  categorie: 'bts_dut' | 'licence' | 'licence_pro' | 'master' | 'master_pro' | 'mba' | 'doctorat' | 'formation_continue' | 'certification';
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
  formationsBTS: number;
  formationsLicence: number;
  formationsMaster: number;
  formationsMBA: number;
  formationsDoctorat: number;
  formationsCertification: number;
  tauxInsertion: number;
}