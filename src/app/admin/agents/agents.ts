import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SupabaseService } from '../../services/supabase';
import { Agent } from '../../models/agent';
import { AddAgentDialog } from '../add-agent-dialog/add-agent-dialog';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './agents.html',
  styleUrls: ['./agents.css'],
})
export class Agents implements OnInit {

  agents = new MatTableDataSource<Agent>();
  displayedColumns: string[] = ['index', 'first_name', 'last_name', 'telephone', 'role', 'status', 'actions'];

  constructor(
    private supabaseService: SupabaseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    await this.loadAgents();

    // Définir le filtre sur certaines colonnes
    this.agents.filterPredicate = (agent: Agent, filter: string) => {
      const dataStr = `${agent.first_name} ${agent.last_name} ${agent.telephone} ${agent.role}`.toLowerCase();
      return dataStr.includes(filter);
    };
  }

  async loadAgents() {
    try {
      const data = await this.supabaseService.getAgents();
      this.agents.data = data;
      console.log('Agents chargés :', data);
    } catch (error) {
      console.error(error);
    }
  }

  openAddAgentDialog() {
    const dialogRef = this.dialog.open(AddAgentDialog, {
      width: '450px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadAgents();
    });
  }

  openEditDialog(agent: Agent) {
    const dialogRef = this.dialog.open(AddAgentDialog, {
      width: '450px',
      data: agent,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadAgents();
    });
  }

  async toggleStatus(agent: Agent, event: MatSlideToggleChange) {
    if (!agent.id) return this.showToast('ID de l’agent manquant', 'error');

    const newStatus = event.checked;
    try {
      await this.supabaseService.updateAgentStatus(agent.id, newStatus);
      agent.status = newStatus;
      this.showToast(`Personnel ${agent.first_name} ${agent.last_name} est maintenant ${newStatus ? 'Actif' : 'Inactif'}`, 'success');
    } catch (err) {
      console.error(err);
      this.showToast('Impossible de changer le status', 'error');
    }
  }

  async deleteAgent(id: string) {
    await this.supabaseService.deleteAgent(id);
    await this.loadAgents();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.agents.filter = filterValue.trim().toLowerCase();
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
