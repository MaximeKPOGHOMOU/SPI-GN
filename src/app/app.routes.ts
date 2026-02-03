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
import { Login } from './admin/login/login';
import { StaffGuard } from './admin/guards/staff.guard';
import { AuthGuard } from './admin/guards/auth.guard';


export const routes: Routes = [

  // 🌍 SITE VITRINE (PAR DÉFAUT)
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'equipe', component: Equipe },
  { path: 'service', component: Service },
  { path: 'contact', component: Contact },

  // 🔐 LOGIN
  { path: 'login', component: Login },

  // 🛠️ ADMIN (STAFF)
  {
    path: 'admin',
    component: Layout,
    canActivate: [AuthGuard, StaffGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'agent', component: Agents },
      { path: 'client', component: Clients },
      { path: 'site', component: Sites },
      { path: 'equipement', component: Equipements },
      { path: 'dotation', component: Dotations },
      { path: 'affectation', component: Affectations },
    ]
  },

  // fallback
  { path: '**', redirectTo: '' }
];

