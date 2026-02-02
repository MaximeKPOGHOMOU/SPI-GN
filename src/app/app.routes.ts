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

export const routes: Routes = [

  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },

  {
    path: 'admin',
    component: Layout,
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

  { path: 'home', component: Home },
  { path: 'about', component: About },
  { path: 'equipe', component: Equipe },
  { path: 'service', component: Service },
  { path: 'contact', component: Contact },

];
