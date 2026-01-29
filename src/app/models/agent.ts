export interface Agent {
  id?: string;
  first_name: string;
  last_name: string;
  telephone: string;
  role: 'agent' | 'admin' | 'superviseur';
  status?: boolean; // true = actif, false = inactif
  created_at?: string;
}
