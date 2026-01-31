import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Equipement } from '../../models/equipement';
import { SupabaseService } from '../../services/supabase';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-equipement-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatCardModule
  ],
  templateUrl: './add-equipement-dialog.html',
})
export class AddEquipementDialog {

  loading = false;
newEquipement: Equipement = {
  code: '',           // généré automatiquement ou saisi
  designation: '',
  categorie: 'accessoire',
  type_usage: 'agent',
  min_stock: 5,
  quantity: 5,
  status: 'disponible',  // ✅ remplace is_active
};


  constructor(
    private dialogRef: MatDialogRef<AddEquipementDialog>,
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data?: Equipement
  ) {
    if (data) {
      this.newEquipement = { ...data }; // si data existe, c'est une modification
    }
  }

async addEquipement() {
  if (!this.newEquipement.designation || !this.newEquipement.type_usage) {
    this.showToast('Veuillez remplir tous les champs obligatoires', 'error');
    return;
  }

  try {
    this.loading = true;

    // 🔹 Calculer automatiquement le status en fonction de la quantité et du min_stock
    this.newEquipement.status = (this.newEquipement.quantity === 0)
      ? 'indisponible'
      : (this.newEquipement.quantity! < (this.newEquipement.min_stock ?? 5))
        ? 'attention'
        : 'disponible';

    if (this.newEquipement.id) {
      // ✅ UPDATE
      await this.supabaseService.updateEquipement(this.newEquipement.id, this.newEquipement);
      this.showToast('Équipement modifié avec succès !', 'success');
    } else {
      // ⭐ GENERER LE CODE EQxxx
      const code = await this.supabaseService.generateEquipementCode();
      this.newEquipement.code = code;

      // ✅ INSERT
      await this.supabaseService.addEquipement(this.newEquipement);
      this.showToast('Équipement ajouté avec succès !', 'success');
    }

    this.dialogRef.close(true);

  } catch (err) {
    console.error('Erreur ajout/modification équipement :', err);
    this.showToast('Impossible de sauvegarder l’équipement', 'error');
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
      panelClass: type === 'success'
        ? ['snackbar-success']
        : ['snackbar-error']
    });
  }
}
