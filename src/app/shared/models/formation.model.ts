export interface Formation {
  id: number;
  nom: string;
  description: string;
  duree: string;
  diplome: string;
  objectifs: string[];
  debouches: string[];
  frais: string;
  niveau: 'licence' | 'master';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateFormationDto {
  nom: string;
  description: string;
  duree: string;
  diplome: string;
  objectifs: string[];
  debouches: string[];
  frais: string;
  niveau: 'licence' | 'master';
}