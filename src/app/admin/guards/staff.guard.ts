import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class StaffGuard implements CanActivate {

  constructor(private router: Router) {}

canActivate(): boolean {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    this.router.navigate(['/login']);
    return false;
  }

  // tous les staff passent
  if (user.type === 'staff') return true;

  // sinon client
  this.router.navigate(['/client/dashboard']);
  return false;
}

}
