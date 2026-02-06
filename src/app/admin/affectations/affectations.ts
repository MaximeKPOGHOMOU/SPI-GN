import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { SupabaseService } from '../../services/supabase';
import { Affectation } from '../../models/affectation';
import { AddAffectationDialog } from '../add-affectation-dialog/add-affectation-dialog';
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

  affectations = new MatTableDataSource<Affectation>([]);
  displayedColumns: string[] = [
    'index', 'agent', 'site', 'date_debut', 'date_fin', 'nb_jours',
    'status', 'type_service', 'type_affectation', 'actions'
  ];

  loading = true;

  constructor(
    private supabaseService: SupabaseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadAffectations();
  }

async loadAffectations() {
  this.loading = true;
  this.cdr.detectChanges();

  try {
    const data = await this.supabaseService.getAffectations();
    console.log('Affectations récupérées:', data);

    this.affectations.data = data;
    this.cdr.detectChanges();

  } catch (error) {
    console.error('Erreur loadAffectations:', error);
    this.showToast('Impossible de charger les affectations', 'error');
  } finally {
    this.loading = false;
    this.cdr.detectChanges(); 
  }
}


  getStatus(a: Affectation): { text: string; color: string } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const debut = new Date(a.date_debut);
    debut.setHours(0, 0, 0, 0);

    const fin = a.date_fin ? new Date(a.date_fin) : null;
    if (fin) fin.setHours(0, 0, 0, 0);

    if (debut > today) return { text: 'À venir', color: 'orange' };
    if (!fin) return { text: 'En cours', color: 'green' };
    if (fin < today) return { text: 'Terminé', color: 'red' };

    return { text: 'En cours', color: 'green' };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.affectations.filter = filterValue.trim().toLowerCase();
  }

  async openAddAffectationDialog() {
    const dialogRef = this.dialog.open(AddAffectationDialog, { width: '450px' });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) await this.loadAffectations();
    });
  }

  async openEditAffectationDialog(a: Affectation) {
    const dialogRef = this.dialog.open(AddAffectationDialog, { width: '450px', data: a });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) await this.loadAffectations();
    });
  }

  async openStopAffectationDialog(a: Affectation) {
    const dialogRef = this.dialog.open(StopAffectationDialog, { width: '450px', data: a });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) await this.loadAffectations();
    });
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }

}
