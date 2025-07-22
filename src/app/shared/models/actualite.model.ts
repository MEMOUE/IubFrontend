export interface Actualite {
  id: number;
  title: string;
  description: string;
  content?: string;
  image: string;
  date: string;
  category?: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateActualiteDto {
  title: string;
  description: string;
  content?: string;
  image: string;
  category?: string;
  published: boolean;
}