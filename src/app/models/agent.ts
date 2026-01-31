export interface Agent {
  id?: string;
  first_name: string;
  last_name: string;
  telephone: string;
  adresse: string; 
  matricule: string; 
  role: 'agent' | 'admin' | 'superviseur';
  status?: boolean; // true = actif, false = inactif
  site_id?: string; // ✅ L'agent appartient à ce site
  created_at?: string;
  site?: { id: string; name: string }; // pour l’affichage

}
