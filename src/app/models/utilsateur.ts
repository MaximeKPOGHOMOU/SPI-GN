export interface Utilisateur {
  id?: string;
  first_name: string;
  last_name: string;
  telephone: string;
  adresse: string;
  matricule?: string;
  status?: boolean;
  role: 'agent' | 'superviseur' | 'direction';
  type: 'staff' | 'client';
  created_at?: string;
  site?: { id: string; name: string };
}
