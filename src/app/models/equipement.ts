export interface Equipement {
  id?: string;
  code: string;
  designation: string;
  categorie?: 'accessoire' | 'materiel';
  type_usage?: 'agent' | 'site';
  min_stock?: number;
  quantity?: number;   // quantité actuelle
  status?: 'disponible' | 'attention' | 'indisponible';
  created_at?: string;
}
