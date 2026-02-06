import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Site } from '../../models/site';
import { SupabaseService } from '../../services/supabase';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from '@angular/material/select';
import { Client } from '../../models/client';

@Component({
  selector: 'app-add-site-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './add-site-dialog.html',
})
export class AddSiteDialog implements OnInit {

  loading = false;
  clients: Client[] = [];

  // Nouveau site à ajouter ou modifier
  newSite: Site = {
    client_id: '',
    name: '',
    adresse: '',
    telephone: '',
  };

  constructor(
    private dialogRef: MatDialogRef<AddSiteDialog>,
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,        // <-- ajouté
    @Inject(MAT_DIALOG_DATA) public data?: Site
  ) {
    if (data) {
      this.newSite = { ...data }; // si data existe, on est en modification
    }
  }

  async ngOnInit() {
    await this.loadClients();
  }

  async loadClients() {
    try {
      this.clients = await this.supabaseService.getClients();
      this.cdr.detectChanges(); // <-- force Angular à détecter les changements
    } catch (err) {
      console.error(err);
      this.showToast('Impossible de charger les clients', 'error');
    }
  }

  // Ajouter ou modifier le site
  async addSite() {
    if (!this.newSite.client_id || !this.newSite.name || !this.newSite.adresse) {
      this.showToast('Veuillez remplir tous les champs', 'error');
      return;
    }

    this.loading = true;

    try {
      if (this.newSite.id) {
        await this.supabaseService.updateSite(this.newSite.id, this.newSite);
        this.showToast('Site modifié avec succès !', 'success');
        this.dialogRef.close(this.newSite); // 🔹 renvoie le site modifié
      } else {
        const createdSite = await this.supabaseService.addSite(this.newSite);
        this.showToast('Site ajouté avec succès !', 'success');
        this.dialogRef.close(createdSite); // 🔹 renvoie l’objet créé
      }
    } catch (err) {
      console.error(err);
      this.showToast('Impossible de sauvegarder le site', 'error');
    } finally {
      this.loading = false;
    }
  }



  close() {
    this.dialogRef.close(false);
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
