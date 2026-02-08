import { Injectable } from '@angular/core';
import { AuthUser, createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Agent } from '../models/agent';
import { Client } from '../models/client';
import { Site } from '../models/site';
import { Equipement } from '../models/equipement';
import { Dotation } from '../models/dotation';
import { Affectation } from '../models/affectation';
import { Utilisateur } from '../models/utilsateur';

@Injectable({
  providedIn: 'root',
})

export class SupabaseService {

  private supabase: SupabaseClient;
  private currentUser: Utilisateur | null = null;




  constructor() {
    // Initialisation du client Supabase avec URL et clé
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // ==================
  // AGENTS
  // ==================





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
 /** Ajouter un agent (crée aussi l'utilisateur Supabase Auth) */
async addAgent(agent: Agent, password: string = 'Temp1234!') {

  if (!agent.first_name || !agent.last_name || !agent.telephone || !agent.adresse) {
    throw new Error('Champs obligatoires manquants');
  }

  // 1️⃣ Création Auth
  const { data: authData, error: authError } =
    await this.supabase.auth.signUp({
      email: `${agent.telephone}@example.com`,
      password
    });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Utilisateur Auth non créé');

  // 2️⃣ Insertion PROFIL
  const { error } = await this.supabase
    .from('users')
    .insert([{
      id: authData.user.id,
      first_name: agent.first_name,
      last_name: agent.last_name,
      telephone: agent.telephone,
      adresse: agent.adresse,
      matricule: agent.matricule,
      role: agent.role,          // 👈 AGENT / DIRECTION / SUPERVISEUR
      status: true
    }]);

  if (error) throw error;
}



async getAgents() {
  const { data, error } = await this.supabase
    .from('users')
    .select('*')
    .in('role', ['agent', 'direction'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Agent[];
}

  /**
   * Met à jour un agent existant
   * @param id ID de l'agent
   * @param agent Données à mettre à jour
   */
async updateAgent(id: string, agent: Agent) {
  const { error } = await this.supabase
    .from('users')   // ❗ PAS agents
    .update({
      first_name: agent.first_name,
      last_name: agent.last_name,
      telephone: agent.telephone,
      adresse: agent.adresse,
      role: agent.role,
      status: agent.status,
      matricule: agent.matricule
    })
    .eq('id', id);

  if (error) throw error;
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
  // async updateAgentStatus(id: string, status: boolean) {
  //   if (!id) throw new Error("ID manquant");

  //   const { data, error } = await this.supabase
  //     .from('agents')
  //     .update({ status })
  //     .eq('id', id);

  //   if (error) throw error;
  //   return data;
  // }

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

  // ================== CLIENTS ==================
  async getClients(): Promise<Client[]> {
    const { data, error } = await this.supabase.from('clients').select('*');
    if (error) {
      console.error(error);
      return [];
    }
    return data || [];
  }

  async addClient(client: Client) {
    const { data, error } = await this.supabase.from('clients').insert([client]);
    if (error) throw error;
    return data;
  }

  async updateClient(id: string, client: Client) {
    const { data, error } = await this.supabase.from('clients').update(client).eq('id', id);
    if (error) throw error;
    return data;
  }

  async deleteClient(id: string) {
    const { data, error } = await this.supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
    return data;
  }

  async updateClientStatus(id: string, status: boolean) {
    if (!id) throw new Error('ID manquant');

    const { data, error } = await this.supabase
      .from('clients')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return data;
  }


  // Gestion des sites
  // sites.service.ts ou supabase.service.ts
  async getSites() {
    const { data, error } = await this.supabase
      .from('sites')
      .select(`
      *,
      client:clients (id, first_name, last_name)
    `);

    if (error) throw error;

    // Ajoute un champ client_name pour le template
    return data.map((site: any) => ({
      ...site,
      client_name: site.client ? `${site.client.first_name} ${site.client.last_name}` : null
    }));
  }


// Ajouter un site et retourner l'ID numérique
async addSite(site: Site) {
  const { data, error } = await this.supabase.from('sites').insert([site]).select().single();
  if (error) throw error;
  return data; // renvoie l’objet complet avec l’ID généré
}



    // 🔹 Enregistrer un scan de présence
// async insertScan(agentId: number, siteId: number) {
//   if (!agentId || !siteId) {
//     throw new Error('agentId ou siteId manquant');
//   }


//   const { data, error } = await this.supabase
//     .from('presences')
//     .insert([{
//       agent_id: Number(agentId),
//       site_id: Number(siteId)
//     }]);

//   if (error) throw error;
//   return data;
// }

async insertScan(userId: string, siteId: number) {
  if (!userId || !siteId) throw new Error('userId ou siteId manquant');

  const { data, error } = await this.supabase
    .from('presences')
    .insert([{ user_id: userId, site_id: siteId }]);

  if (error) throw error;
  return data;
}





  async updateSite(id: string, site: Site & { client?: any; client_name?: string }) {
    // Ne garder que les champs valides pour la table
    const payload: any = {
      client_id: site.client_id,
      name: site.name,
      adresse: site.adresse,
      telephone: site.telephone
    };

    const { data, error } = await this.supabase.from('sites').update(payload).eq('id', id);
    if (error) throw error;
    return data;
  }


  async deleteSite(id: string) {
    const { data, error } = await this.supabase.from('sites').delete().eq('id', id);
    if (error) throw error;
    return data;
  }

  // ==================
  // EQUIPEMENTS
  // ==================

  async getEquipements(): Promise<Equipement[]> {
    const { data, error } = await this.supabase
      .from('equipements')  // nom de la table
      .select('*');

    if (error) {
      console.error('Erreur getEquipements:', error); // corrige le message
      return [];
    }

    // On caste le résultat pour TypeScript
    return (data as Equipement[]) || [];
  }


  async decreaseEquipementStock(equipementId: string, quantite: number) {

    const { data, error } = await this.supabase
      .from('equipements')
      .select('quantity, min_stock')
      .eq('id', equipementId)
      .single();

    if (error) throw error;

    const newQuantity = data.quantity - quantite;

    let status = 'disponible';

    if (newQuantity <= 0) {
      status = 'indisponible';
    } else if (newQuantity < data.min_stock) {
      status = 'attention';
    }

    const { error: updateError } = await this.supabase
      .from('equipements')
      .update({
        quantity: newQuantity,
        status
      })
      .eq('id', equipementId);

    if (updateError) throw updateError;
  }




  /**
   * Ajoute un nouvel équipement
   * @param equip Equipement à ajouter
   */
  async addEquipement(equip: Omit<Equipement, 'id' | 'created_at'>) {
    // Générer un code unique pour l'équipement si non fourni
    if (!equip.code) {
      equip.code = await this.generateEquipementCode();
    }

    const { data, error } = await this.supabase.from('equipements').insert([equip]);
    if (error) throw error;
    return data;
  }

  /**
   * Met à jour un équipement existant
   * @param id ID de l'équipement
   * @param equip Données à mettre à jour
   */
  async updateEquipement(id: string, equip: Partial<Equipement>) {
    const { data, error } = await this.supabase
      .from('equipements')
      .update(equip)
      .eq('id', id);

    if (error) throw error;
    return data;
  }

  /**
   * Génère un code unique pour l'équipement
   * Format : EQ + 3 chiffres incrémentés (ex: EQ001)
   */
  async generateEquipementCode(): Promise<string> {
    const equipments = await this.getEquipements();
    let lastNumber = 0;

    if (equipments.length) {
      // Récupère le dernier code existant
      const codes = equipments
        .map(e => e.code)
        .filter(code => code.startsWith('EQ'))
        .map(code => parseInt(code.slice(2), 10))
        .sort((a, b) => b - a);

      lastNumber = codes[0] || 0;
    }

    const newNumber = (lastNumber + 1).toString().padStart(3, '0');
    return `EQ${newNumber}`;
  }


  // ==================
  // Demande de dotation
  // ==================

  async getDemandes(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('dotations')
      .select(`
      id,
      code,
      quantite,
      date_dotation,

      agent:agents (
        id,
        first_name,
        last_name
      ),

      site:sites (
        id,
        name
      ),

      equipement:equipements (
        id,
        designation
      )
    `)
      .order('date_dotation', { ascending: false });

    if (error) {
      console.error('Erreur getDemandes:', error);
      return [];
    }

    return data || [];
  }



  /**
   * Ajoute un nouvel équipement
   * @param equip Equipement à ajouter
   */
  async addDemande(equip: Omit<Dotation, 'id' | 'created_at'>) {
    // Générer un code unique pour l'équipement si non fourni
    if (!equip.code) {
      equip.code = await this.generateDemandeCode();
    }

    const { data, error } = await this.supabase.from('dotations').insert([equip]);
    if (error) throw error;
    return data;
  }

  /**
   * Met à jour un équipement existant
   * @param id ID de l'équipement
   * @param equip Données à mettre à jour
   */
  async updateDemande(id: string, equip: Partial<Dotation>) {
    const { data, error } = await this.supabase
      .from('dotations')
      .update(equip)
      .eq('id', id);

    if (error) throw error;
    return data;
  }

  /**
   * Génère un code unique pour l'équipement
   * Format : EQ + 3 chiffres incrémentés (ex: EQ001)
   */
  async generateDemandeCode(): Promise<string> {
    const demandes = await this.getDemandes();
    let lastNumber = 0;

    if (demandes.length) {
      const numbers = demandes
        .map(d => d.code)
        .filter(code => code?.startsWith('dm-spi-gn-'))
        .map(code => parseInt(code.replace('dm-spi-gn-', ''), 10))
        .filter(n => !isNaN(n))
        .sort((a, b) => b - a);

      lastNumber = numbers[0] || 0;
    }

    const newNumber = (lastNumber + 1).toString().padStart(3, '0');
    return `dm-spi-gn-${newNumber}`;
  }

// ==================
// AFFECTATIONS
// ==================

/**
 * Ajoute une nouvelle affectation pour un agent
 * Si l'agent a une affectation en cours, on met à jour sa date_fin
 * @param affectation Affectation à ajouter (incluant date_debut et optionnel date_fin)
 */
async addAffectation(affectation: Omit<Affectation, 'id'>) {
  if (!affectation.agent_id || !affectation.site_id || !affectation.date_debut) {
    throw new Error('Agent, site et date de début sont obligatoires');
  }

  // 1️⃣ Vérifier si l'agent a une affectation en cours
  const { data: enCours, error: err1 } = await this.supabase
    .from('affectations')
    .select('id')
    .eq('agent_id', affectation.agent_id)
    .is('date_fin', null);

  if (err1) throw err1;

  // 2️⃣ Terminer l'affectation en cours si elle existe
  if (enCours && enCours.length > 0) {
    const affectationEnCoursId = enCours[0].id;
    const { error: err2 } = await this.supabase
      .from('affectations')
      .update({ date_fin: new Date().toISOString() })
      .eq('id', affectationEnCoursId);

    if (err2) throw err2;
  }

  // 3️⃣ Insérer la nouvelle affectation avec tous les champs
  const { data: newAffectation, error: err3 } = await this.supabase
    .from('affectations')
    .insert([{
      agent_id: affectation.agent_id,
      site_id: affectation.site_id,
      date_debut: affectation.date_debut,
      date_fin: affectation.date_fin || null,
      status: affectation.status ?? true,
      type_service: affectation.type_service ?? 'jour',
      type_affectation: affectation.type_affectation ?? 'fixe',
    }]);

  if (err3) throw err3;

  return newAffectation;
}

/**
 * Termine l'affectation en cours d'un agent
/**
 * Stop une affectation et calcule le nombre de jours
 * @param agentId ID de l'agent
 * @param dateFin Optionnel, date de fin personnalisée
 */
async stopAffectation(agentId: number, dateFin?: Date) {

  const fin = dateFin ?? new Date();

  // 1️⃣ Récupérer l'affectation en cours
  const { data: affectation, error: fetchError } = await this.supabase
    .from('affectations')
    .select('id, date_debut')
    .eq('agent_id', agentId)
    .is('date_fin', null)
    .single();

  if (fetchError) throw fetchError;

  // 2️⃣ Calcul du nombre de jours
  const debut = new Date(affectation.date_debut);
  const diffTime = fin.getTime() - debut.getTime();

  // +1 si tu veux compter le jour de début
  const nbJours = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 3️⃣ Mise à jour
  const { data, error } = await this.supabase
    .from('affectations')
    .update({
      date_fin: fin.toISOString(),
      status: false,
      nb_jours: nbJours
    })
    .eq('id', affectation.id);

  if (error) throw error;

  return data;
}

async updateAgentStatus(agentId: number, status: boolean) {
  const { error } = await this.supabase
    .from('agents')
    .update({ status })
    .eq('id', agentId);

  if (error) throw error;
}


/**
 * Récupère toutes les affectations d'un agent
 * @param agentId Optionnel, si non fourni, retourne toutes les affectations
 */
async getAffectations(): Promise<Affectation[]> {
  const { data, error } = await this.supabase
    .from('affectations')
    .select(`
      *,
      agent:agents (id, first_name, last_name),
      site:sites (id, name)
    `)
    .order('date_debut', { ascending: false });

  if (error) {
    console.error('Erreur loadAffectations:', error);
    return [];
  }
  return data || [];
}


/**
 * Modifie une affectation existante
 * @param id ID de l'affectation
 * @param affectation Données à modifier (site_id, date_debut, date_fin)
 */
async updateAffectation(
  id: string,
  affectation: Partial<Affectation> // <-- accepte tous les champs
) {
  const { data, error } = await this.supabase
    .from('affectations')
    .update(affectation)
    .eq('id', id);

  if (error) throw error;
  return data;
}


async login(email: string, password: string): Promise<Utilisateur> {
  // 🔹 Connexion via Supabase Auth
  const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({ email, password });
  if (authError || !authData.user) throw authError;

  const authUser = authData.user;

  // 🔹 Récupérer le profil depuis la table users
  const { data: profile, error: profileError } = await this.supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle(); // ✅ évite l'erreur "Cannot coerce"

  if (profileError) throw profileError;
  if (!profile) throw new Error('Utilisateur non trouvé');

  const utilisateur: Utilisateur = profile as Utilisateur;

  // 🔹 Vérifier le rôle
  // 🔹 Stocker localement
  localStorage.setItem('user', JSON.stringify(utilisateur));
  this.currentUser = utilisateur;

  return utilisateur;
}

  // Déconnexion
  async logout() {
    await this.supabase.auth.signOut();
    localStorage.removeItem('user');
  }

  // Récupérer le profil complet dans la table users
  async getUserProfile(authId: string): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', authId)
      .single();

    if (error) throw error;
    return data as User;
  }

  // Récupérer le user connecté depuis Supabase
  async getCurrentUserProfile(): Promise<User | null> {
    const { data } = await this.supabase.auth.getSession();
    if (!data.session?.user) return null;
    return this.getUserProfile(data.session.user.id);
  }

  // Récupérer le user connecté
async getCurrentUser(): Promise<Utilisateur | null> {
  // 1️⃣ Récupère la session
  const { data: sessionData, error: sessionError } = await this.supabase.auth.getSession();

  if (sessionError) {
    console.error('Erreur session Supabase:', sessionError);
    return null;
  }

  // 2️⃣ Vérifie que sessionData et session existent
  if (!sessionData || !sessionData.session || !sessionData.session.user) {
    console.warn('Aucun utilisateur connecté');
    return null;
  }

  const userId = sessionData.session.user.id;

  // 3️⃣ Récupère le profil dans la table `users`
  const { data, error } = await this.supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Erreur getCurrentUser:', error);
    return null;
  }

  return data as Utilisateur;
}

async getPresenceByMonth(agentId: number, month: number, year: number) {
  const { data, error } = await this.supabase
    .from('presences')
    .select('*')
    .eq('agent_id', agentId)
    .gte('scan_time', `${year}-${month}-01`)
    .lte('scan_time', `${year}-${month}-${new Date(year, month, 0).getDate()}`);

  if (error) {
    console.error('Erreur Supabase:', error);
    return [];
  }
  return data;
}


}
