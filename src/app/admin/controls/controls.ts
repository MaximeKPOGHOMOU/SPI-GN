import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';

interface Agent {
  id: number;
  first_name: string;
  last_name: string;
}

interface PresenceDay {
  date: Date;
  present: boolean;
}

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule
  ],
  templateUrl: './controls.html',
  styleUrls: ['./controls.css']
})
export class Controls implements OnInit {
 agents: Agent[] = [];
  selectedAgent!: Agent | null;
  selectedDate!: Date | null;
  presenceDays: PresenceDay[] = [];
  totalPresentDays: number = 0;

  ngOnInit() {
    // MOCK: récupérer agents
    this.agents = [
      { id: 1, first_name: 'John', last_name: 'Doe' },
      { id: 2, first_name: 'Jane', last_name: 'Smith' },
      { id: 3, first_name: 'Alice', last_name: 'Johnson' }
    ];
  }

  // Récupérer le mois choisi dans le datepicker
  chosenMonthHandler(normalizedMonth: Date, datepicker: any) {
    if (!this.selectedDate) this.selectedDate = new Date();
    this.selectedDate.setMonth(normalizedMonth.getMonth());
    this.selectedDate.setFullYear(normalizedMonth.getFullYear());
    datepicker.close();
  }

  // Générer les jours du mois et définir présent/absent (mock)
  showPresence() {
    if (!this.selectedAgent || !this.selectedDate) return;

    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Ici tu devrais récupérer les jours de présence depuis ton API
    // Mock: on fait des jours aléatoires
    this.presenceDays = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const isPresent = Math.random() > 0.3; // 70% chance de présence
      this.presenceDays.push({
        date: new Date(year, month, d),
        present: isPresent
      });
    }

    this.calculatePresence();
  }

  // Calculer le nombre de jours présents
  calculatePresence() {
    if (!this.presenceDays || this.presenceDays.length === 0) {
      this.totalPresentDays = 0;
      return;
    }
    this.totalPresentDays = this.presenceDays.filter(day => day.present).length;
  }

  // Pourcentage de présence
  getPresencePercentage(): number {
    if (!this.presenceDays || this.presenceDays.length === 0) return 0;
    return Math.round((this.totalPresentDays / this.presenceDays.length) * 100);
  }

}
