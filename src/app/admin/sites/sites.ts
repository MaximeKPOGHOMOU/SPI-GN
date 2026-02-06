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
import { MatSlideToggleModule, MatSlideToggleChange } from "@angular/material/slide-toggle";

import { Site } from '../../models/site';
import { SupabaseService } from '../../services/supabase';
import { AddSiteDialog } from '../add-site-dialog/add-site-dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sites',
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
  templateUrl: './sites.html',
  styleUrls: ['./sites.css']
})
export class Sites implements OnInit {

  sites = new MatTableDataSource<Site>(); // datasource de la table
  displayedColumns: string[] = ['index', 'name', 'adresse', 'telephone', 'client_id', 'actions'];
  loading = true; // affiche spinner pendant le chargement
  qrImageUrl: string | null = null;
  selectedSiteForQr: Site | null = null;


  constructor(
    private supabaseService: SupabaseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    await this.loadSites();
    this.cdr.detectChanges();
  }

  generateQrForSite(site: Site) {
    if (!site.id) {
      this.showToast('ID du site introuvable', 'error');
      return;
    }

    const qrContent = site.id.toString(); // ID numérique
    this.qrImageUrl =
      'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' +
      encodeURIComponent(qrContent);

    this.selectedSiteForQr = site;
  }

  downloadQr() {
    if (!this.qrImageUrl || !this.selectedSiteForQr) return;

    const link = document.createElement('a');
    link.href = this.qrImageUrl;
    link.download = `qr-site-${this.selectedSiteForQr.id}.png`;
    link.click();
  }


  // 🔹 Charger les sites depuis Supabase
  async loadSites() {
    this.loading = true;  // start spinner
    try {
      const data = await this.supabaseService.getSites();
      this.sites.data = data;   // assign data
      this.cdr.detectChanges(); // 🔹 force Angular à mettre à jour le DOM
    } catch (err) {
      console.error('Erreur loadSites:', err);
      this.showToast('Impossible de charger les sites', 'error');
    } finally {
      this.loading = false;     // stop spinner
      this.cdr.detectChanges(); // 🔹 assure que spinner disparaît
    }
  }


  // 🔹 Filtrer les sites par recherche
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.sites.filter = filterValue.trim().toLowerCase();
  }

  // 🔹 Ouvrir la boîte de dialogue pour ajouter un site
openAddSiteDialog() {
  const dialogRef = this.dialog.open(AddSiteDialog, { width: '450px', panelClass: 'custom-dialog-container' });
  dialogRef.afterClosed().subscribe((result: Site) => {
    if (result) {
      this.loadSites();              // recharge la table
      this.generateQrForSite(result); // génère le QR
    }
  });
}

openEditSiteDialog(site: Site) {
  const dialogRef = this.dialog.open(AddSiteDialog, {
    width: '450px',
    data: site,
    panelClass: 'custom-dialog-container'
  });
  dialogRef.afterClosed().subscribe((result: Site) => {
    if (result) {
      this.loadSites();
      this.generateQrForSite(result); // QR mis à jour
    }
  });
}


  // 🔹 Supprimer un site
  async deleteSite(id?: string) {
    if (!id) return this.showToast('ID site manquant', 'error');
    try {
      await this.supabaseService.deleteSite(id); // méthode à créer côté service
      this.showToast('Site supprimé avec succès', 'success');
      await this.loadSites();
    } catch (err) {
      console.error(err);
      this.showToast('Impossible de supprimer le site', 'error');
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

  // 🔹 Imprimer la liste des sites
  printSites() {
    const tableElement = document.querySelector('.full-table') as HTMLElement;
    if (!tableElement) return this.showToast('Aucun tableau à imprimer', 'error');

    const printWindow = window.open('', '', 'width=900,height=700');
    if (!printWindow) return this.showToast('Impossible d’ouvrir la fenêtre d’impression', 'error');

    const htmlContent = `
      <html>
        <head>
          <title>Liste des sites</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #1976d2; color: white; }
            h2 { text-align: center; font-family: Arial, sans-serif; }
            button { display: none; } /* supprime les boutons lors de l'impression */
          </style>
        </head>
        <body>
          <h2>Liste des sites</h2>
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
