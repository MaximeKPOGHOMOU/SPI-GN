import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SupabaseService } from '../../services/supabase';
import { Agent } from '../../models/agent';
import { Site } from '../../models/site';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-affectation-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatCardModule
  ],
  templateUrl: './add-affectation-dialog.html',
})
export class AddAffectationDialog implements OnInit {

  affectation: any = {
    date_debut: '',
    date_fin: '',
  };
  agents: Agent[] = [];
  sites: Site[] = [];
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<AddAffectationDialog>,
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
    if (data) this.affectation = { ...data };
  }

async ngOnInit() {
  try {
    this.agents = await this.supabaseService.getAgents();
    this.sites = await this.supabaseService.getSites();

    if (this.data) {
      this.affectation = {
        id: this.data.id,
        agent_id: this.data.agent_id ?? this.data.agent?.id,
        site_id: this.data.site_id ?? this.data.site?.id,
        date_debut: this.data.date_debut?.substring(0, 10) ?? '',
        date_fin: this.data.date_fin?.substring(0, 10) ?? '',
        status: this.data.status ?? true
      };
    }

    // 🔥 LA LIGNE QUI FIX TOUT
    this.cdr.detectChanges();

  } catch (err) {
    console.error(err);
  }
}


  // Comparaison pour mat-select
  compareById = (a: any, b: any) => Number(a) === Number(b);

  async saveAffectation() {
    if (!this.affectation.agent_id || !this.affectation.site_id || !this.affectation.date_debut) {
      this.showToast('Veuillez sélectionner un agent, un site et saisir la date de début', 'error');
      return;
    }

    this.loading = true;

    try {
      if (this.affectation.id) {
        // 🔁 MODIFICATION
        await this.supabaseService.updateAffectation(
          this.affectation.id,
          {
            agent_id: this.affectation.agent_id,
            site_id: this.affectation.site_id,
            date_debut: this.affectation.date_debut,
            date_fin: this.affectation.date_fin || null,
          }
        );
        this.showToast('Affectation modifiée avec succès !', 'success');
      } else {
        // ➕ NOUVELLE AFFECTATION
        await this.supabaseService.addAffectation({
          agent_id: this.affectation.agent_id,
          site_id: this.affectation.site_id,
          date_debut: this.affectation.date_debut,
          date_fin: this.affectation.date_fin || null,
          status: true
        });
        this.showToast('Affectation ajoutée avec succès !', 'success');

        // 🔥 Mettre le status de l’agent à true
        await this.supabaseService.updateAgentStatus(this.affectation.agent_id, true);
      }

      this.dialogRef.close(true);

    } catch (err) {
      console.error('Erreur saveAffectation:', err);
      this.showToast('Impossible de sauvegarder l’affectation', 'error');
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
