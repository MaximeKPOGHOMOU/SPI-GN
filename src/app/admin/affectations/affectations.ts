import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';

import { SupabaseService } from '../../services/supabase';
import { Agent } from '../../models/agent';
import { AddAffectationDialog } from '../add-affectation-dialog/add-affectation-dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Affectation } from '../../models/affectation';
import { StopAffectationDialog } from '../stop-affectation-dialog/stop-affectation-dialog';

@Component({
  selector: 'app-affectations',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './affectations.html',
  styleUrls: ['./affectations.css'],
})
export class Affectations implements OnInit {

  // ==================
  // 🔹 PROPRIÉTÉS
  // ==================
  affectations = new MatTableDataSource<Affectation>();
  displayedColumns: string[] = [
    'index', 'agent', 'site', 'date_debut', 'date_fin', 'jours_effectues', 'status','actions'
  ];
  loading = true;

  constructor(
    private supabaseService: SupabaseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  // ==================
  // 🔹 CYCLE DE VIE
  // ==================
  async ngOnInit() {
    await this.loadAffectations();
    this.cdr.detectChanges();
  }

  // ==================
  // 🔹 CHARGEMENT DES AFFECTATIONS
  // ==================
async loadAffectations() {
  this.loading = true;

  try {
    const data = await this.supabaseService.getAffectations();
    console.log('Affectations récupérées:', data);

    this.affectations.data = [...data]; // 🔥 TRÈS IMPORTANT

  } catch (error) {
    console.error('Erreur loadAffectations:', error);
    this.showToast('Impossible de charger les affectations', 'error');
  } finally {
    this.loading = false;
  }
}


getJoursEffectues(a: Affectation): number {
  // 🔒 Tant que la date de fin n’existe pas → 0
  if (!a.date_debut || !a.date_fin) return 0;

  const dateDebut = new Date(a.date_debut);
  const dateFin = new Date(a.date_fin);

  dateDebut.setHours(0, 0, 0, 0);
  dateFin.setHours(0, 0, 0, 0);

  // Sécurité
  if (dateFin < dateDebut) return 0;

  const diffTime = dateFin.getTime() - dateDebut.getTime();

  // +1 pour compter le jour de début
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}





  getStatus(a: Affectation): { text: string; color: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const debut = new Date(a.date_debut);
  debut.setHours(0, 0, 0, 0);

  const fin = a.date_fin ? new Date(a.date_fin) : null;
  if (fin) fin.setHours(0, 0, 0, 0);

  if (debut > today) {
    return { text: 'À venir', color: 'orange' };
  }

  if (!fin) {
    return { text: 'En cours', color: 'green' };
  }

  if (fin < today) {
    return { text: 'Terminé', color: 'red' };
  }

  return { text: 'En cours', color: 'green' };
}


  /** Filtre le tableau en fonction de la saisie utilisateur */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.affectations.filter = filterValue.trim().toLowerCase();
  }

  // ==================
  // 🔹 GESTION DES AFFECTATIONS
  // ==================

  /** Ouvre le dialogue pour ajouter une affectation */
 async openAddAffectationDialog() {
    const dialogRef = this.dialog.open(AddAffectationDialog, {
      width: '450px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) await this.loadAffectations();
    });
  }

 async openEditAffectationDialog(affectation: Affectation) {
  const dialogRef = this.dialog.open(AddAffectationDialog, {
    width: '450px',
    panelClass: 'custom-dialog-container',
    data: affectation   // 🔥 TRÈS IMPORTANT
  });

  dialogRef.afterClosed().subscribe(async (result) => {
    if (result) {
      await this.loadAffectations();
    }
  });
}

async openStopAffectationDialog(affectation: Affectation) {
  const dialogRef = this.dialog.open(StopAffectationDialog, {
    width: '450px',
    panelClass: 'custom-dialog-container',
    data: affectation
  });

  dialogRef.afterClosed().subscribe(async (result) => {
    if (result) {
      await this.loadAffectations();
    }
  });
}



  
async stopAffectation(agent: Agent) {
  if (!agent.id) return this.showToast('ID agent manquant', 'error');

  // Vérifier si l'affectation est déjà arrêtée
  if (!agent.status) {
    this.showToast(`L'affectation de ${agent.first_name} ${agent.last_name} est déjà arrêtée`);
    return;
  }

  try {
    // Arrêter l'affectation
    await this.supabaseService.stopAffectation(Number(agent.id));

    // Mettre à jour le status localement
    agent.status = false;

    this.showToast(`Affectation de ${agent.first_name} ${agent.last_name} arrêtée`, 'success');
    await this.loadAffectations(); // recharge la liste
  } catch (err) {
    console.error(err);
    this.showToast('Impossible d’arrêter l’affectation', 'error');
  }
}



  // ==================
  // 🔹 UTILITAIRES
  // ==================
  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }
}
