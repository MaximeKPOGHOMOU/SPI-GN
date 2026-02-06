import { Routes } from '@angular/router';
import { About } from './about/about';
import { Service } from './service/service';
import { Contact } from './contact/contact';
import { Equipe } from './equipe/equipe';
import { Home } from './home/home';
import { Agents } from './admin/agents/agents';
import { Clients } from './admin/clients/clients';
import { Sites } from './admin/sites/sites';
import { Equipements } from './admin/equipements/equipements';
import { Dotations } from './admin/dotations/dotations';
import { Dashboard } from './admin/dashboard/dashboard';
import { Layout } from './admin/layout/layout';
import { Affectations } from './admin/affectations/affectations';
import { Controls } from './admin/controls/controls';
import { ScanQrCode } from './admin/scan-qr-code/scan-qr-code';
import { Login } from './admin/login/login';
import { AuthGuard } from './admin/guards/auth.guard';
import { StaffGuard } from './admin/guards/staff.guard';
import { RoleGuard } from './admin/guards/role.guard';

export const routes: Routes = [

  // Redirection par défaut → login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Page login
  { path: 'login', component: Login },

  // ADMIN → layout avec guards
  {
    path: 'admin',
    component: Layout,
    canActivate: [AuthGuard, StaffGuard],
    children: [
      // redirection par défaut pour staff normal
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

      // Superviseur → scan uniquement
      {
        path: 'scan',
        component: ScanQrCode,
        canActivate: [RoleGuard],
        data: { roles: ['superviseur'] }
      },

      // Staff normal → dashboard + modules
      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [RoleGuard],
        data: { roles: ['agent','operation','direction'] }
      },
      { path: 'agent', component: Agents, canActivate: [RoleGuard], data: { roles: ['agent','operation','direction'] } },
      { path: 'client', component: Clients, canActivate: [RoleGuard], data: { roles: ['agent','operation','direction'] } },
      { path: 'site', component: Sites, canActivate: [RoleGuard], data: { roles: ['agent','operation','direction'] } },
      { path: 'equipement', component: Equipements, canActivate: [RoleGuard], data: { roles: ['agent','operation','direction'] } },
      { path: 'dotation', component: Dotations, canActivate: [RoleGuard], data: { roles: ['agent','operation','direction'] } },
      { path: 'affectation', component: Affectations, canActivate: [RoleGuard], data: { roles: ['agent','operation','direction'] } },
      { path: 'control', component: Controls, canActivate: [RoleGuard], data: { roles: ['agent','operation','direction'] } },
    ]
  },

  // Pages publiques
  { path: 'home', component: Home },
  { path: 'about', component: About },
  { path: 'equipe', component: Equipe },
  { path: 'service', component: Service },
  { path: 'contact', component: Contact },

  // Fallback → login
  { path: '**', redirectTo: 'login' }
];
