export interface Client {
  id?: string;
  first_name: string;
  last_name: string;
  telephone: string;
  adresse: string; 
  matricule: string; 
  status?: boolean; 
  created_at?: string;
}
