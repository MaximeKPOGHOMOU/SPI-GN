import { Component, Inject, OnInit } from '@angular/core';
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
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-add-agent-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule],
  templateUrl: './add-agent-dialog.html',
})
export class AddAgentDialog {
  sites: { id: string; name: string; client_name?: string }[] = [];
  loading = false;
  newAgent: Agent = {
    first_name: '',
    last_name: '',
    telephone: '',
    adresse: '',
    matricule: '',
    status: false,
  };

  constructor(
    private dialogRef: MatDialogRef<AddAgentDialog>,
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data?: Agent
  ) {
    if (data) this.newAgent = { ...data };
  }

  ngOnInit() {
    this.loadSites();
  }

  async loadSites() {
    try {
      this.sites = await this.supabaseService.getSites(); // ✅ pas de .data
    } catch (err) {
      console.error('Erreur loadSites:', err);
      this.showToast('Impossible de charger les sites', 'error');
    }
  }

async addAgent() {
  if (!this.newAgent.first_name || !this.newAgent.last_name ||
      !this.newAgent.telephone ) {
    this.showToast('Veuillez remplir tous les champs', 'error');
    return;
  }

  try {
    this.loading = true;

    if (this.newAgent.id) {
      // ✅ Si prénom ou nom modifié, recalculer le matricule
      const existingAgent = await this.supabaseService.getAgents();
      const oldAgent = existingAgent.find(a => a.id === this.newAgent.id);

      if (oldAgent && (oldAgent.first_name !== this.newAgent.first_name || oldAgent.last_name !== this.newAgent.last_name)) {
        this.newAgent.matricule = await this.supabaseService.generateMatricule(
          this.newAgent.first_name, this.newAgent.last_name
        );
      }

      await this.supabaseService.updateAgent(this.newAgent.id, this.newAgent);
      this.showToast('Agent modifié avec succès !', 'success');

    } else {
      // ✅ Nouveau agent
      const matricule = await this.supabaseService.generateMatricule(
        this.newAgent.first_name, this.newAgent.last_name
      );
      this.newAgent.matricule = matricule;

      await this.supabaseService.addAgent(this.newAgent);
      this.showToast('Agent ajouté avec succès !', 'success');
    }

    this.dialogRef.close(true);

  } catch (err) {
    console.error('Erreur ajout/modification agent :', err);
    this.showToast('Impossible de sauvegarder l’agent', 'error');
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
