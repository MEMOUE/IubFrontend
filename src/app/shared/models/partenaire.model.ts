export interface BaseEntity {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EcolePartenaire extends BaseEntity {
  nom: string;
  pays: string;
  ville: string;
  type: string;
  region: 'europe' | 'amerique' | 'afrique';
  description?: string;
  domaines: string[];
  programmes: string[];
  avantages: string[];
  dureePartenariat?: string;
  siteWeb?: string;
  emailContact?: string;
  actif: boolean;
}

export interface EntreprisePartenaire extends BaseEntity {
  nom: string;
  secteur: string;
  taille: string;
  localisation: string;
  typePartenariat?: string;
  description?: string;
  collaborations: string[];
  postes: string[];
  avantages: string[];
  dureePartenariat?: string;
  siteWeb?: string;
  emailContact?: string;
  responsableContact?: string;
  actif: boolean;
}

// Interface pour les statistiques
export interface StatistiquePartenaire {
  valeur: string | number;
  label: string;
}

// Interface pour les options de dropdown
export interface RegionOption {
  code: string;
  label: string;
  icon: string;
}

// Types pour les régions
export type RegionType = 'europe' | 'amerique' | 'afrique';

// Types pour les secteurs d'entreprise
export type SecteurType = 'telecoms' | 'banque' | 'technologie' | 'industrie' | 'sante' | 'education' | 'energie' | 'transport' | 'agriculture' | 'commerce' | 'finance' | 'immobilier' | 'tourisme' | 'media' | 'juridique' | 'consultance' | 'autre';

// Types pour les tailles d'entreprise
export type TailleEntrepriseType = 'TPE' | 'PME' | 'ETI' | 'Grande entreprise';

// Interface pour les données de création/modification
export interface CreateEcolePartenaireData {
  nom: string;
  pays: string;
  ville: string;
  type: string;
  region: RegionType;
  description?: string;
  domaines?: string[];
  programmes?: string[];
  avantages?: string[];
  dureePartenariat?: string;
  siteWeb?: string;
  emailContact?: string;
  actif?: boolean;
}

export interface CreateEntreprisePartenaireData {
  nom: string;
  secteur: string;
  taille: string;
  localisation: string;
  typePartenariat?: string;
  description?: string;
  collaborations?: string[];
  postes?: string[];
  avantages?: string[];
  dureePartenariat?: string;
  siteWeb?: string;
  emailContact?: string;
  responsableContact?: string;
  actif?: boolean;
}

// Interface pour les réponses API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Interface pour les erreurs de validation
export interface ValidationError {
  field: string;
  message: string;
  rejectedValue?: any;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  errors?: ValidationError[];
}

// Fonctions utilitaires pour les types
export function isValidRegion(region: string): region is RegionType {
  return ['europe', 'amerique', 'afrique'].includes(region);
}

export function isValidSecteur(secteur: string): secteur is SecteurType {
  const secteurs: SecteurType[] = [
    'telecoms', 'banque', 'technologie', 'industrie', 'sante', 
    'education', 'energie', 'transport', 'agriculture', 'commerce', 
    'finance', 'immobilier', 'tourisme', 'media', 'juridique', 
    'consultance', 'autre'
  ];
  return secteurs.includes(secteur as SecteurType);
}

export function isValidTailleEntreprise(taille: string): taille is TailleEntrepriseType {
  return ['TPE', 'PME', 'ETI', 'Grande entreprise'].includes(taille);
}

// Constantes
export const REGIONS: RegionOption[] = [
  { code: 'europe', label: 'Europe', icon: 'pi pi-globe' },
  { code: 'amerique', label: 'Amérique', icon: 'pi pi-flag' },
  { code: 'afrique', label: 'Afrique', icon: 'pi pi-sun' }
];

export const TYPES_ETABLISSEMENT = [
  'Université publique',
  'Université privée',
  'École de commerce',
  'École d\'ingénieur',
  'Institut spécialisé',
  'École supérieure',
  'Centre de formation',
  'Institut de recherche',
  'École d\'art',
  'École de médecine'
];

export const SECTEURS_ENTREPRISE = [
  'Télécommunications',
  'Banque & Finance',
  'Technologie & IT',
  'Industrie',
  'Santé',
  'Éducation',
  'Énergie',
  'Transport & Logistique',
  'Agriculture',
  'Commerce & Distribution',
  'Immobilier',
  'Tourisme & Hôtellerie',
  'Média & Communication',
  'Juridique',
  'Conseil & Services',
  'Autre'
];

export const TAILLES_ENTREPRISE = [
  'TPE (moins de 10 salariés)',
  'PME (10 à 249 salariés)',
  'ETI (250 à 4999 salariés)',
  'Grande entreprise (5000+ salariés)'
];