export interface Site {
  id?: string;         // identifiant unique
  client_id: string;   // référence au client
  name: string;        // nom du site (ex: "Site principal", "Usine X")
  adresse: string;     // adresse du site
  telephone?: string;  // téléphone du site
  created_at?: string; // date de création

  
}
