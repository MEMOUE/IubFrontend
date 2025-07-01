import { Routes } from '@angular/router';
import { AccueilComponent } from './components/accueil/accueil.component';
import { PresentationComponent } from './components/universites/presentation/presentation.component';
import { DirecteurComponent } from './components/universites/directeur/directeur.component';
import { TemoingnageComponent } from './components/universites/temoingnage/temoingnage.component';
import { ListepartenairesComponent } from './components/universites/ecoles-partenaires/listepartenaires/listepartenaires.component';
import { DetailspartenairesComponent } from './components/universites/ecoles-partenaires/detailspartenaires/detailspartenaires.component';
import { NewpartenairesComponent } from './components/universites/ecoles-partenaires/newpartenaires/newpartenaires.component';
import { ListeEntreprisePartenairesComponent } from './components/universites/entreprise-partenaires/liste-entreprise-partenaires/liste-entreprise-partenaires.component';
import { DetailEntreprisePartenairesComponent } from './components/universites/entreprise-partenaires/detail-entreprise-partenaires/detail-entreprise-partenaires.component';
import { NewEntreprisePartenairesComponent } from './components/universites/entreprise-partenaires/new-entreprise-partenaires/new-entreprise-partenaires.component';
import { ListeformationComponent } from './components/formation/listeformation/listeformation.component';
import { DetailsformationComponent } from './components/formation/detailsformation/detailsformation.component';
import { NewformationComponent } from './components/formation/newformation/newformation.component';
import { ListeactualitesComponent } from './components/actualites/listeactualites/listeactualites.component';
import { NewactualitesComponent } from './components/actualites/newactualites/newactualites.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { LoginComponent } from './components/admin/login/login.component';
import { AccueilAdminComponent } from './components/admin/accueil-admin/accueil-admin.component';

export const routes: Routes = [
    // Route par défaut - Page d'accueil
    { path: '', redirectTo: '/accueil', pathMatch: 'full' },
    { path: 'accueil', component: AccueilComponent },
    
    // Routes Université
    { path: 'universite/presentation', component: PresentationComponent },
    { path: 'universite/directeur', component: DirecteurComponent },
    { path: 'universite/temoingnages', component: TemoingnageComponent },
    
    // Routes Écoles Partenaires
    { path: 'universite/ecoles-partenaires', component: ListepartenairesComponent },
    { path: 'universite/ecoles-partenaires/details/:id', component: DetailspartenairesComponent },
    { path: 'universite/ecoles-partenaires/nouveau', component: NewpartenairesComponent },
    
    // Routes Entreprises Partenaires
    { path: 'universite/entreprises-partenaires', component: ListeEntreprisePartenairesComponent },
    { path: 'universite/entreprises-partenaires/details/:id', component: DetailEntreprisePartenairesComponent },
    { path: 'universite/entreprises-partenaires/nouveau', component: NewEntreprisePartenairesComponent },
    
    // Routes Formations
    { path: 'formations', component: ListeformationComponent },
    { path: 'formations/details/:id', component: DetailsformationComponent },
    { path: 'formations/nouveau', component: NewformationComponent },
    
    // Routes Actualités
    { path: 'actualites', component: ListeactualitesComponent },
    { path: 'actualites/nouveau', component: NewactualitesComponent },
    
    // Route Contacts
    { path: 'contacts', component: ContactsComponent },
    
    // Routes Admin
    { path: 'admin/login', component: LoginComponent },
    { path: 'admin', component: AccueilAdminComponent },
    
    // Route wildcard - doit être en dernier
    { path: '**', redirectTo: '/accueil' }
];