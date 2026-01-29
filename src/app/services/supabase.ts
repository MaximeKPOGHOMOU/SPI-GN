import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Agent } from '../models/agent';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {

   private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // ==================
  // AGENTS
  // ==================
async getAgents(): Promise<Agent[]> {
  const { data, error } = await this.supabase.from('agents').select('*');
  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
}


  async addAgent(agent: any) {
    const { data, error } = await this.supabase.from('agents').insert([agent]);
    if (error) throw error;
    return data;
  }

  async updateAgent(id: string, agent: any) {
    const { data, error } = await this.supabase.from('agents').update(agent).eq('id', id);
    if (error) throw error;
    return data;
  }

  async deleteAgent(id: string) {
    const { data, error } = await this.supabase.from('agents').delete().eq('id', id);
    if (error) throw error;
    return data;
  }

async updateAgentStatus(id: string, status: boolean) {
  if (!id) throw new Error("ID manquant");

  const { data, error } = await this.supabase
    .from('agents')
    .update({ status })   // mettre à jour le champ status
    .eq('id', id);

  if (error) throw error;
  return data;
}





  // ==================
  // AUTHENTIFICATION
  // ==================
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }
  
}
