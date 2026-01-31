import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from '../../models/client';
import { SupabaseService } from '../../services/supabase';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-add-client-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule
  ],
  templateUrl: './add-client-dialog.html',
})
export class AddClientDialog {

  loading = false;

  newClient: Client = {
    first_name: '',
    last_name: '',
    telephone: '',
    adresse: '',
    matricule: '',
    status: true,
  };

  constructor(
    private dialogRef: MatDialogRef<AddClientDialog>,
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data?: Client
  ) {
    if (data) {
      this.newClient = { ...data }; // si data existe, c'est une modification
    }
  }

  async addClient() {
    // Vérification des champs obligatoires
    if (!this.newClient.first_name || 
        !this.newClient.last_name || 
        !this.newClient.telephone ||
        !this.newClient.adresse) {
      this.showToast('Veuillez remplir tous les champs', 'error');
      return;
    }

    try {
      this.loading = true;

      if (this.newClient.id) {
        // UPDATE client existant
        await this.supabaseService.updateClient(this.newClient.id, this.newClient);
        this.showToast('Client modifié avec succès !', 'success');
      } else {
        // GENERER LE MATRICULE
        const matricule = await this.supabaseService.generateMatricule(
          this.newClient.first_name,
          this.newClient.last_name
        );
        this.newClient.matricule = matricule;

        // INSERT nouveau client
        await this.supabaseService.addClient(this.newClient);
        this.showToast('Client ajouté avec succès !', 'success');
      }

      this.dialogRef.close(true);

    } catch (err) {
      console.error('Erreur ajout/modification client :', err);
      this.showToast('Impossible de sauvegarder le client', 'error');
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
