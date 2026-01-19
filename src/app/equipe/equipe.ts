import { Component } from '@angular/core';
import { Header } from "../header/header";
import { CommonModule } from '@angular/common';
import { Info } from "../info/info";

@Component({
  selector: 'app-equipe',
  imports: [Header, CommonModule, Info, CommonModule],
  templateUrl: './equipe.html',
  styleUrl: './equipe.css',
})
export class Equipe {

  showAll = false;

    guards = [
      { name: ' Ousmane TOURE', role: 'Directeur général adjoint', image: 'assets/images/dga.jpg' },
      { name: 'Jean Ahmadou SOW', role: 'Responsable Financier ', image: 'assets/images/dg.jpg' },
      { name: 'Maxime KPOGHOMOU', role: 'Responsable IT', image: 'assets/images/maxime.jpeg' },
      { name: 'Oumou Salamata BARRY', role: 'Comptable', image: 'assets/images/barry.jpg' },
      { name: 'Aly 2 CONDE', role: 'Responsable des Opérations ', image: 'assets/images/conde.jpg' },
      { name: 'Boulkhere FALL', role: 'Responsable Incendie', image: 'assets/images/fall.jpg' },
      { name: 'Mawa KABA', role: 'Responsable Marketing', image: 'assets/images/maxime.jpeg' },
      { name: 'Djènabou SAHKO', role: 'Assistante COMPTABLE ', image: 'assets/images/dg.jpg' },
      { name: 'Ousmane Amadou CAMARA', role: 'cousier', image: 'assets/images/maxime.jpeg' },

  ];

   initialLimit = 6;

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  getDisplayedGuards() {
    return this.showAll ? this.guards : this.guards.slice(0, this.initialLimit);
  }

}
