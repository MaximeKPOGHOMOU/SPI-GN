export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  type: 'staff' | 'client';
  role: 'agent' | 'superviseur' | 'operation' | 'direction' | 'client';
  status: boolean;
}
