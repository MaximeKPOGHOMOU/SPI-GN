import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = route.data['roles'] as string[];

    if (!allowedRoles || allowedRoles.includes(user.role)) {
      return true; // ✅ autorisé
    }

    // 🔁 Redirection intelligente si rôle non autorisé
    if (user.role === 'superviseur') {
      this.router.navigate(['/admin/scan']);
    } else {
      this.router.navigate(['/admin/dashboard']);
    }

    return false;
  }
}
