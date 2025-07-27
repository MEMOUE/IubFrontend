// src/app/shared/models/admin.model.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}

export interface AdministrateurInfo {
  id: number;
  username: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  premiereConnexion: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  administrateur: AdministrateurInfo | null;
}

export interface Administrateur {
  id?: number;
  username: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  actif: boolean;
  premiereConnexion: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Pour compatibilité avec l'ancien système
export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  premiereConnexion: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  accessToken?: string;
  refreshToken?: string;
}