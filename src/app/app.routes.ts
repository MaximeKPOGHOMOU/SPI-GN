import { Routes } from '@angular/router';
import { About } from './about/about';
import { Service } from './service/service';
import { Contact } from './contact/contact';
import { Equipe } from './equipe/equipe';
import { Home } from './home/home';
import { Agents } from './admin/agents/agents';
import { Clients } from './admin/clients/clients';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'about', component: About },
    { path: 'equipe', component: Equipe },
    { path: 'service', component: Service },
    { path: 'contact', component: Contact },
    { path: 'contact', component: Contact },
    // { path: 'admin', component: Contact },
    { path: 'admin/agent', component: Agents },
    { path: 'admin/client', component: Clients },

    
];

