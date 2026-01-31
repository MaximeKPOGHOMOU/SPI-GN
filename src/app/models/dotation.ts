export interface Dotation {
  id?: string;
  agent_id: string;         // agent destinataire
  site_id: string;          // site où l'équipement est donné
  equipement_id: string;    // équipement donné
  quantite: number;         // quantité donnée
  date_dotation?: string;   // date de la dotation
  code: string;             // code de la demande

  // Pour l’affichage
  agent_name?: string;      // nom complet de l’agent
  site_name?: string;       // nom du site
  equipement?: { 
    code: string; 
    designation: string 
  };
}
