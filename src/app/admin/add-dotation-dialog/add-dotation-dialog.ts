import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Dotation } from '../../models/dotation';
import { SupabaseService } from '../../services/supabase';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Agent } from '../../models/agent';
import { Equipement } from '../../models/equipement';

@Component({
  selector: 'app-add-dotation-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule],
  templateUrl: './add-dotation-dialog.html',
})
export class AddDotationDialog implements OnInit {
  sites: { id: string; name: string }[] = [];
  agents: Agent[] = [];
  equipements: Equipement[] = [];

  loading = false;

  newDotation: Dotation = {
    agent_id: '',
    site_id: '',
    equipement_id: '',
    quantite: 1,
    code: '',
  };

  constructor(
    private dialogRef: MatDialogRef<AddDotationDialog>,
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data?: Dotation
  ) {
    if (data) this.newDotation = { ...data };
  }

  ngOnInit() {
    this.loadData();
  }

  
  async loadData() {
    try {
      this.sites = await this.supabaseService.getSites();
      this.agents = await this.supabaseService.getAgents();
      this.equipements = await this.supabaseService.getEquipements();
      this.cd.detectChanges();
    } catch (err) {
      console.error('Erreur loadData:', err);
      this.showToast('Impossible de charger les données', 'error');
    }
  }

async saveDotation() {

  if (!this.newDotation.agent_id || 
      !this.newDotation.site_id || 
      !this.newDotation.equipement_id || 
      !this.newDotation.quantite) {

    this.showToast('Veuillez remplir tous les champs obligatoires', 'error');
    return;
  }

  try {

    this.loading = true;

    // 🔥 Vérifier le stock AVANT
    const equipement = this.equipements.find(
      e => e.id === this.newDotation.equipement_id
    );

    if (!equipement) {
      this.showToast("Équipement introuvable", 'error');
      return;
    }

    if ((equipement.quantity ?? 0) < this.newDotation.quantite) {
      this.showToast("Stock insuffisant !", 'error');
      return;
    }

const payload = {
  agent_id: this.newDotation.agent_id,
  site_id: this.newDotation.site_id,
  equipement_id: this.newDotation.equipement_id,
  quantite: this.newDotation.quantite,
  code: this.newDotation.code,
  date_dotation: this.newDotation.date_dotation ?? new Date().toISOString()
};

    if (this.newDotation.id) {

      // UPDATE
      await this.supabaseService.updateDemande(this.newDotation.id, payload);

    } else {

      // INSERT
      payload.code = await this.supabaseService.generateDemandeCode();
      await this.supabaseService.addDemande(payload);

      // 🔥 DIMINUER LE STOCK AUTOMATIQUEMENT
      await this.supabaseService.decreaseEquipementStock(
        payload.equipement_id,
        payload.quantite
      );
    }

    this.showToast('Dotation enregistrée avec succès !', 'success');
    this.dialogRef.close(true);

  } catch (err) {

    console.error('Erreur ajout/modification dotation :', err);
    this.showToast('Impossible de sauvegarder la dotation', 'error');

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
