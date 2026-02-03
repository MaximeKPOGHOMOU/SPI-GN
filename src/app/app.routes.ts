import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Equipe } from './equipe/equipe';
import { Service } from './service/service';
import { Contact } from './contact/contact';

export const routes: Routes = [

  // 🔁 REDIRECTION AU LANCEMENT
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // 🌍 SITE VITRINE
  { path: 'home', component: Home },
  { path: 'about', component: About },
  { path: 'equipe', component: Equipe },
  { path: 'service', component: Service },
  { path: 'contact', component: Contact },

  // ❌ ROUTE INCONNUE → HOME
  { path: '**', redirectTo: 'home' }
];
