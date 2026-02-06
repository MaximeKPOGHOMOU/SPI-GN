export interface Affectation {
  id?: string;
  agent_id: string;
  site_id: string;
  date_debut: string;
  date_fin?: string | null;
  nb_jours?: number;
  status?: boolean; // vrai = actif, faux = terminé

  type_service?: 'jour' | 'nuit';
  type_affectation?: 'fixe' | 'temporaire' | 'remplacement';

  // Pour l’affichage
  agent_name?: string; 
  site_name?: string;

  // Champs temporaires pour l'affichage
  status_text?: string;   // "À venir", "En cours", "Terminé"
  status_color?: string;  // "blue", "green", "red"
}
