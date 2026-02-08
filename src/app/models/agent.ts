export interface Agent {
  id?: string;
  first_name: string;
  last_name: string;
  telephone: string;
  adresse: string;
  matricule?: string;
  role: 'agent' | 'direction' | 'superviseur';
  status: boolean;
}