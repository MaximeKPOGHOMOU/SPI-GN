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

import { Client } from '../../models/client';
import { SupabaseService } from '../../services/supabase';
import { AddClientDialog } from '../add-client-dialog/add-client-dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-clients',
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
    MatProgressSpinnerModule,
    MatSlideToggleModule
],
  templateUrl: './clients.html',
  styleUrls: ['./clients.css']
})
export class Clients implements OnInit {

  clients = new MatTableDataSource<Client>(); // datasource de la table
  displayedColumns: string[] = ['index', 'matricule', 'first_name', 'last_name', 'telephone', 'adresse', 'status', 'actions'];
  loading = true; // affiche spinner pendant le chargement

  constructor(
    private supabaseService: SupabaseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadClients();
    this.cdr.detectChanges();
  }

  // 🔹 Charger les clients depuis Supabase
  async loadClients() {
    this.loading = true;
    try {
      const data = await this.supabaseService.getClients(); // méthode à créer côté service
      console.log('Clients récupérés:', data);
      this.clients.data = data;
    } catch (err) {
      console.error('Erreur loadClients:', err);
      this.showToast('Impossible de charger les clients', 'error');
    } finally {
      this.loading = false;
    }
  }

  // 🔹 Filtrer les clients par recherche
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.clients.filter = filterValue.trim().toLowerCase();
  }

  // 🔹 Ouvrir la boîte de dialogue pour ajouter un client
  openAddClientDialog() {
    const dialogRef = this.dialog.open(AddClientDialog, { width: '450px', panelClass: 'custom-dialog-container' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadClients();
    });
  }

  // 🔹 Ouvrir la boîte de dialogue pour modifier un client
  openEditClientDialog(client: Client) {
    const dialogRef = this.dialog.open(AddClientDialog, {
      width: '450px',
      data: client,
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadClients();
    });
  }

  // 🔹 Supprimer un client
  async deleteClient(id?: string) {
    if (!id) return this.showToast('ID client manquant', 'error');
    try {
      await this.supabaseService.deleteClient(id); // méthode à créer côté service
      this.showToast('Client supprimé avec succès', 'success');
      await this.loadClients();
    } catch (err) {
      console.error(err);
      this.showToast('Impossible de supprimer le client', 'error');
    }
  }

  // 🔹 Afficher les notifications
  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }

  // 🔹 Imprimer la liste des clients
  printClients() {
    const tableElement = document.querySelector('.full-table') as HTMLElement;
    if (!tableElement) return this.showToast('Aucun tableau à imprimer', 'error');

    const printWindow = window.open('', '', 'width=900,height=700');
    if (!printWindow) return this.showToast('Impossible d’ouvrir la fenêtre d’impression', 'error');

    const htmlContent = `
      <html>
        <head>
          <title>Liste des clients</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #1976d2; color: white; }
            h2 { text-align: center; font-family: Arial, sans-serif; }
            button { display: none; } /* supprime les boutons lors de l'impression */
          </style>
        </head>
        <body>
          <h2>Liste des clients</h2>
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

  async toggleStatus(client: Client, event: MatSlideToggleChange) {
  if (!client.id) return this.showToast('ID client manquant', 'error');

  const newStatus = event.checked;
  try {
    await this.supabaseService.updateClientStatus(client.id, newStatus); // méthode à créer dans le service
    client.status = newStatus;
    this.showToast(
      `Client ${client.first_name} ${client.last_name} est maintenant ${newStatus ? 'Actif' : 'Inactif'}`, 
      'success'
    );
  } catch (err) {
    console.error(err);
    this.showToast('Impossible de changer le statut', 'error');
  }
}
}
