import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Agent } from '../../models/agent';
import { SupabaseService } from '../../services/supabase';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardModule } from "@angular/material/card";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-agent-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule],
  templateUrl: './add-agent-dialog.html',
})
export class AddAgentDialog {

newAgent: Agent = {
  first_name: '',
  last_name: '',
  telephone: '',
  role: 'agent',
  status: true, // actif par défaut
};

  constructor(
    private dialogRef: MatDialogRef<AddAgentDialog>,
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data?: Agent
  ) {
    if (data) {
    this.newAgent = { ...data }; // si data existe, c'est une modification
  }}
async addAgent() {
  if (!this.newAgent.first_name || !this.newAgent.last_name || !this.newAgent.telephone) {
    this.showToast('Veuillez remplir tous les champs', 'error');
    return;
  }

  try {
    if (this.newAgent.id) {
      // ❌ Modification : si id existe, on update
      await this.supabaseService.updateAgent(this.newAgent.id, this.newAgent);
      this.showToast('Personnel modifié avec succès !', 'success');
    } else {
      // ✅ Ajout
      await this.supabaseService.addAgent(this.newAgent);
      this.showToast('Personnel ajouté avec succès !', 'success');
    }

    this.dialogRef.close(true); // ferme le dialogue et indique succès
  } catch (err) {
    console.error('Erreur ajout/modification agent :', err);
    this.showToast('Impossible de sauvegarder l’agent', 'error');
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
