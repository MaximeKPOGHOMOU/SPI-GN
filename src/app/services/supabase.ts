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
    // Initialisation du client Supabase avec URL et clé
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // ==================
  // AGENTS
  // ==================

  /**
   * Récupère tous les agents depuis la table 'agents'
   * @returns Liste d'agents
   */
  async getAgents(): Promise<Agent[]> {
    const { data, error } = await this.supabase.from('agents').select('*');
    if (error) {
      console.error('Erreur getAgents:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Génère un matricule unique pour un nouvel agent
   * Format : 2 lettres du prénom + 2 lettres du nom + 3 chiffres (ex: JOPE001)
   * @param prenom Prénom de l'agent
   * @param nom Nom de l'agent
   * @returns Matricule généré
   */
  async generateMatricule(prenom: string, nom: string): Promise<string> {
    // Récupère le dernier agent pour déterminer le prochain numéro
    const agents = await this.getAgents();
    const lastAgent = agents.length ? agents[agents.length - 1] : null;
    const lastMatricule = lastAgent?.matricule || null;

    const pre = prenom.substring(0, 2).toUpperCase();
    const no = nom.substring(0, 2).toUpperCase();

    // Si aucun agent précédent, commence à 001
    let number = '001';
    if (lastMatricule) {
      const lastNumber = parseInt(lastMatricule.slice(-3), 10);
      number = String(lastNumber + 1).padStart(3, '0');
    }

    return `${pre}${no}${number}`;
  }

  /**
   * Ajoute un nouvel agent dans la base
   * @param agent Agent à ajouter
   */
  async addAgent(agent: any) {
    const { data, error } = await this.supabase.from('agents').insert([agent]);
    if (error) throw error;
    return data;
  }

  /**
   * Met à jour un agent existant
   * @param id ID de l'agent
   * @param agent Données à mettre à jour
   */
  async updateAgent(id: string, agent: any) {
    const { data, error } = await this.supabase.from('agents').update(agent).eq('id', id);
    if (error) throw error;
    return data;
  }

  /**
   * Supprime un agent
   * @param id ID de l'agent
   */
  async deleteAgent(id: string) {
    const { data, error } = await this.supabase.from('agents').delete().eq('id', id);
    if (error) throw error;
    return data;
  }

  /**
   * Met à jour le status (actif/inactif) d'un agent
   * @param id ID de l'agent
   * @param status Nouveau status
   */
  async updateAgentStatus(id: string, status: boolean) {
    if (!id) throw new Error("ID manquant");

    const { data, error } = await this.supabase
      .from('agents')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return data;
  }

  // ==================
  // AUTHENTIFICATION
  // ==================

  /**
   * Connexion d'un utilisateur avec email et mot de passe
   * @param email Email de l'utilisateur
   * @param password Mot de passe
   */
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  /**
   * Déconnexion de l'utilisateur actuel
   */
  async signOut() {
    await this.supabase.auth.signOut();
  }
}
