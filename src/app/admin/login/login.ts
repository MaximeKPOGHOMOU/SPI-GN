import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Utilisateur } from '../../models/utilsateur';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule],
})
export class Login {
  email: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(
    private sb: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) { }

  async login() {
    if (!this.email || !this.password) {
      this.showToast('Veuillez saisir votre email et mot de passe', 'error');
      return;
    }

    try {
      this.loading = true;
      const user: Utilisateur = await this.sb.login(this.email, this.password);

      // 🔐 stocker l'utilisateur
      localStorage.setItem('user', JSON.stringify(user));

      this.showToast(`Bienvenue ${user.first_name} ${user.last_name}`, 'success');

      // 🎯 REDIRECTION PAR RÔLE
      if (user.type === 'staff') {

        if (user.role === 'superviseur') {
          this.router.navigate(['/admin/scan']);
        } else {
          this.router.navigate(['/admin/dashboard']);
        }

      } else {
        this.router.navigate(['/client/dashboard']);
      }

    } catch (e: any) {
      this.showToast(e.message || 'Erreur de connexion', 'error');
    } finally {
      setTimeout(() => {
        this.loading = false;
        this.cdr.detectChanges();
      });
    }
  }


  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error'],
    });
  }
}
