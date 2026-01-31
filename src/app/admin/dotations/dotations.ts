import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SupabaseService } from '../../services/supabase';
import { Dotation } from '../../models/dotation';
import { AddDotationDialog } from '../add-dotation-dialog/add-dotation-dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dotations',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dotations.html',
  styleUrls: ['./dotations.css'],
})
export class Dotations implements OnInit {

  dotations = new MatTableDataSource<Dotation>();
  displayedColumns: string[] = [
    'index', 'code', 'agent_name', 'site_name', 'equipement', 'quantite', 'date_dotation', 'actions'
  ];
  loading = true;

  constructor(
    private supabaseService: SupabaseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadDotations();
    this.cdr.detectChanges();
  }

  /** Charge toutes les dotations depuis Supabase */
  async loadDotations() {
    this.loading = true;
    try {
      const data = await this.supabaseService.getDemandes(); // getDemandes() retourne Dotation[]
      console.log('Dotations récupérées:', data);
      this.dotations.data = data;
    } catch (error) {
      console.error('Erreur loadDotations:', error);
      this.showToast('Impossible de charger les dotations', 'error');
    } finally {
      this.loading = false;
    }
  }

  /** Filtre le tableau */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dotations.filter = filterValue.trim().toLowerCase();
  }

  /** Ouvre le dialogue pour ajouter une dotation */
  openAddDotationDialog() {
    const dialogRef = this.dialog.open(AddDotationDialog, {
      width: '500px',
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadDotations();
    });
  }

  /** Ouvre le dialogue pour modifier une dotation existante */
openEditDialog(dotation: any) {

  const formattedDotation = {
    ...dotation,
    agent_id: dotation.agent?.id ?? dotation.agent_id,
    site_id: dotation.site?.id ?? dotation.site_id,
    equipement_id: dotation.equipement?.id ?? dotation.equipement_id
  };

  const dialogRef = this.dialog.open(AddDotationDialog, {
    width: '500px',
    data: formattedDotation,
    panelClass: 'custom-dialog-container'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) this.loadDotations();
  });
}


  /** Imprime la liste des dotations */
  printDotations() {
    const tableElement = document.querySelector('.full-table') as HTMLElement;
    if (!tableElement) return this.showToast('Aucun tableau à imprimer', 'error');

    const tableClone = tableElement.cloneNode(true) as HTMLElement;
    const buttons = tableClone.querySelectorAll('button');
    buttons.forEach(btn => btn.remove());

    const printWindow = window.open('', '', 'width=900,height=700');
    if (!printWindow) return this.showToast('Impossible d’ouvrir la fenêtre d’impression', 'error');

    const htmlContent = `
      <html>
        <head>
          <title>Liste des dotations</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #1976d2; color: white; }
            h2 { text-align: center; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          <h2>Liste des dotations</h2>
          ${tableClone.outerHTML}
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  }

  /** Affiche un message toast */
  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }
}
