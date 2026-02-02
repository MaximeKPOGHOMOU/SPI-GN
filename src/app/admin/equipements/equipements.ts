import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SupabaseService } from '../../services/supabase';
import { Equipement } from '../../models/equipement';
import { MatTableDataSource } from '@angular/material/table';
import { AddEquipementDialog } from '../add-equipement-dialog/add-equipement-dialog';
import { MatSelect, MatSelectModule } from "@angular/material/select";

@Component({
  selector: 'app-equipements',
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
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './equipements.html',
  styleUrls: ['./equipements.css'],
})
export class Equipements implements OnInit {

  // ==================
  // 🔹 PROPRIÉTÉS
  // ==================
  equipements = new MatTableDataSource<Equipement>();
  displayedColumns: string[] = [
    'index', 'code', 'designation', 'categorie', 'type_usage', 'status', 'quantity', 'actions'
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
    await this.loadEquipements();
    this.cdr.detectChanges();
  }

  // ==================
  // 🔹 GESTION DES EQUIPEMENTS
  // ==================
  async loadEquipements() {
    this.loading = true;
    try {
      const data = await this.supabaseService.getEquipements();

      // 🔹 Calculer le status pour chaque équipement
      data.forEach(e => {
        e.status = e.quantity === 0 ? 'indisponible'
          : e.quantity! < (e.min_stock || 5) ? 'attention'
            : 'disponible';
      });

      this.equipements.data = data;
    } catch (error) {
      console.error('Erreur loadEquipements:', error);
    } finally {
      this.loading = false;
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.equipements.filter = filterValue.trim().toLowerCase();
  }

  /** Ouvre le dialogue pour ajouter un équipement */
  openAddEquipementDialog() {
    const dialogRef = this.dialog.open(AddEquipementDialog, {
      width: '450px',
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadEquipements();
    });
  }

  /** Ouvre le dialogue pour modifier un équipement existant */
  openEditDialog(equipement: Equipement) {
    const dialogRef = this.dialog.open(AddEquipementDialog, {
      width: '450px',
      data: equipement,
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadEquipements();
    });
  }



  /** Génère un code automatique EQ001, EQ002... */
  async generateCode(): Promise<string> {
    const equipements = await this.supabaseService.getEquipements();
    const codes = equipements
      .map(e => e.code)
      .filter(code => code.startsWith('EQ'))
      .map(code => parseInt(code.slice(2), 10))
      .sort((a, b) => b - a);

    const lastNumber = codes[0] || 0;
    const newNumber = (lastNumber + 1).toString().padStart(3, '0');
    return `EQ${newNumber}`;
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

  getStatusColor(e: Equipement): string {
    switch (e.status) {
      case 'disponible': return 'green ';
      case 'attention': return 'orange';
      case 'indisponible': return 'red';
      default: return 'black';
    }
  }

  // 🔹 Imprimer la liste des sites
  printEquippements() {
    const tableElement = document.querySelector('.full-table') as HTMLElement;
    if (!tableElement) return this.showToast('Aucun tableau à imprimer', 'error');

    const printWindow = window.open('', '', 'width=900,height=700');
    if (!printWindow) return this.showToast('Impossible d’ouvrir la fenêtre d’impression', 'error');

    const htmlContent = `
      <html>
        <head>
          <title>Liste des equippements</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #1976d2; color: white; }
            h2 { text-align: center; font-family: Arial, sans-serif; }
            button { display: none; } /* supprime les boutons lors de l'impression */
          </style>
        </head>
        <body>
          <h2>Liste des equippements</h2>
          ${tableElement.outerHTML}
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


}
