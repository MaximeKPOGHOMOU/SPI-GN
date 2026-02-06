export interface Utilisateur {
    id?: string;
  first_name: string;
  last_name: string;
  telephone: string;
  adresse?: string;       // 🔹 maintenant optionnel
  matricule: string;
  role?: 'agent' | 'superviseur' | 'operation' | 'direction' | 'client';
  type?: 'staff';
  status?: boolean;
  site_id?: number;
  created_at?: string;
  site?: { id: number; name: string };
}


