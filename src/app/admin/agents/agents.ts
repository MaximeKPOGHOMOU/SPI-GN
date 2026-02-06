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
import { Agent } from '../../models/agent';
import { AddAgentDialog } from '../add-agent-dialog/add-agent-dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-agents',
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
  templateUrl: './agents.html',
  styleUrls: ['./agents.css'],
})
export class Agents implements OnInit {

  // ==================
  // 🔹 PROPRIÉTÉS
  // ==================
  agents = new MatTableDataSource<Agent>();           // Source de données pour la table
displayedColumns: string[] = ['index', 'matricule', 'first_name', 'last_name', 'telephone', 'adresse', 'role', 'status', 'actions'];

  loading = true;                                     // Indicateur de chargement

  // ==================
  // 🔹 CONSTRUCTEUR
  // ==================
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
    await this.loadAgents();     // Charge les agents au démarrage
    this.cdr.detectChanges();    // Force la détection des changements
  }

  // ==================
  // 🔹 GESTION DES AGENTS
  // ==================
  /** Charge tous les agents depuis Supabase */
  async loadAgents() {
    this.loading = true;
    try {
      const data = await this.supabaseService.getAgents();
      console.log('Agents récupérés:', data);
      this.agents.data = data;
    } catch (error) {
      console.error('Erreur loadAgents:', error);
    } finally {
      this.loading = false;
    }
  }

  /** Filtre le tableau en fonction de la saisie utilisateur */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.agents.filter = filterValue.trim().toLowerCase();
  }

  /** Ouvre le dialogue pour ajouter un agent */
  openAddAgentDialog() {
    const dialogRef = this.dialog.open(AddAgentDialog, {
      width: '450px',
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadAgents();
    });
  }

  /** Ouvre le dialogue pour modifier un agent existant */
  openEditDialog(agent: Agent) {
    const dialogRef = this.dialog.open(AddAgentDialog, {
      width: '450px',
      data: agent,
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadAgents();
    });
  }

  /** Supprime un agent */
  async deleteAgent(id: string) {
    await this.supabaseService.deleteAgent(id);
    await this.loadAgents();
  }

  /** Génère un matricule à partir du prénom, nom et dernier numéro */
  generateMatricule(prenom: string, nom: string, lastNumber: number): string {
    const pre = prenom.substring(0, 2).toUpperCase();
    const no = nom.substring(0, 2).toUpperCase();
    const number = String(lastNumber + 1).padStart(3, '0');
    return `${pre}${no}${number}`;
  }

  // ==================
  // 🔹 IMPRESSION
  // ==================
  /** Imprime la liste des agents */
printAgents() {
  // Récupère le tableau de la page
  const tableElement = document.querySelector('.full-table') as HTMLElement;
  if (!tableElement) return this.showToast('Aucun tableau à imprimer', 'error');

  // Clone le tableau pour le manipuler sans affecter le DOM
  const tableClone = tableElement.cloneNode(true) as HTMLElement;

  // Supprime tous les boutons du clone
  const buttons = tableClone.querySelectorAll('button');
  buttons.forEach(btn => btn.remove());

  // Crée une nouvelle fenêtre pour l'impression
  const printWindow = window.open('', '', 'width=900,height=700');
  if (!printWindow) return this.showToast('Impossible d’ouvrir la fenêtre d’impression', 'error');

  // Génère le HTML à imprimer
  const htmlContent = `
    <html>
      <head>
        <title>Liste des personnels</title>
        <style>
          table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #1976d2; color: white; }
          h2 { text-align: center; font-family: Arial, sans-serif; }
        </style>
      </head>
      <body>
        <h2>Liste des personnels</h2>
        ${tableClone.outerHTML}
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Attendre que le contenu soit chargé puis lancer l'impression
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
}


  // ==================
  // 🔹 UTILITAIRES
  // ==================
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
