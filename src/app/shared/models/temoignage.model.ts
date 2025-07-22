export interface Temoignage {
  id: number;
  nom: string;
  formation: string;
  promotion: string;
  poste: string;
  temoignage: string;
  note: number;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}