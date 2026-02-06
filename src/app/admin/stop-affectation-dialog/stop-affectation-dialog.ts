import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SupabaseService } from "../../services/supabase";
import { Affectation } from "../../models/affectation";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";

@Component({
  selector: 'app-stop-affectation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './stop-affectation-dialog.html'
})
export class StopAffectationDialog {

  date_fin = '';

  constructor(
    private dialogRef: MatDialogRef<StopAffectationDialog>,
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public affectation: Affectation
  ) {}

async confirm() {
  if (!this.date_fin) {
    this.showToast(`Veuillez saisir la date de fin`, 'error');
    return;
  }

  if (this.date_fin < this.affectation.date_debut) {
      this.showToast(`La date de fin doit être ≥ date début`, 'error');
    return;
  }

  try {
    // 1️⃣ Arrêter l’affectation
    await this.supabaseService.stopAffectation(
      Number(this.affectation.agent_id),
      new Date(this.date_fin),
      
    );

    // 2️⃣ 🔥 METTRE À JOUR LE STATUS DE L’AGENT
    await this.supabaseService.updateAgentStatus(
      Number(this.affectation.agent_id),
      false
    );

    this.showToast(`Affectation arrêtée avec succès`, 'success');
    this.dialogRef.close(true);

  } catch (err) {
    console.error(err);
    this.showToast('Erreur lors de l’arrêt', 'error');
  }
}

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }


  cancel() {
    this.dialogRef.close(false);
  }

  
}
