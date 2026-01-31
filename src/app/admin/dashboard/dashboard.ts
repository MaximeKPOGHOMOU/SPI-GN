import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { SupabaseService } from '../../services/supabase';
import { Agent } from '../../models/agent';
import { Client } from '../../models/client';
import { Site } from '../../models/site';
import { Equipement } from '../../models/equipement';

@Component({
  selector: 'app-dashboard',
  imports: [MatIcon],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard  implements OnInit{
public agentsCount = 0;       // ✅ public pour template
  public clientsCount = 0;
  public sitesCount = 0;
  public equipementsCount = 0;

  constructor(private supabaseService: SupabaseService,     private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCounts();
    this.cdr.detectChanges();    // Force la détection des changements
  }

async loadCounts() {
  try {
    const agents: Agent[] = await this.supabaseService.getAgents();
    this.agentsCount = agents.length;

    const clients: Client[] = await this.supabaseService.getClients();
    this.clientsCount = clients.length;
    console.log('Total clients:', this.clientsCount);

    const sites: Site[] = await this.supabaseService.getSites();
    this.sitesCount = sites.length;

    const equipements: Equipement[] = await this.supabaseService.getEquipements();
    this.equipementsCount = equipements.length;

    // 🔹 Forcer Angular à détecter les changements après avoir mis à jour les variables
    this.cdr.detectChanges();

  } catch (error) {
    console.error('Erreur chargement counts:', error);
  }
}

  }

