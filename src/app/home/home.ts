import { ChangeDetectorRef, Component } from '@angular/core';
import { Info } from "../info/info";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from "../header/header";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, Info, Header, RouterModule, FormsModule,],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  clients = [
    {
      name: 'BANQUE CENTRALE DE LA REPUBLIQUE DE GUINEE',
      description: 'Client fidèle bénéficiant de nos services de gardiennage et electronique.',
      image: 'assets/images/bcrg.png'
    },
    {
      name: 'GUITER S.A',
      description: 'Client fidèle bénéficiant de nos services de gardiennage.',
      image: 'assets/images/guitter.jpg'
    },
    {
      name: 'BURVAL CORPORATE S.A GUINEE',
      description: 'Client fidèle bénéficiant de nos services de gardiennage.',
      image: 'assets/images/burval.jpg'
    }
  ];

  guards = [
    { name: 'Sékou SOUMAHORO', role: 'Président directeur général ', image: 'assets/images/dg.jpg' },
    { name: ' Ousmane TOURE', role: 'Directeur général adjoint', image: 'assets/images/dga.jpg' },
    { name: 'Maxime KPOGHOMOU', role: 'Responsable IT', image: 'assets/images/it.jpg' },

  ];




  form = { name: '', email: '', subject: '', message: '' };
  loading = false;

  constructor(
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.resetForm();
  }

  resetForm() {
    this.form = { name: '', email: '', subject: '', message: '' };
    this.loading = false;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSubmit(form: NgForm) {

    if (!this.form.name.trim() || !this.form.email.trim() ||
      !this.form.subject.trim() || !this.form.message.trim()) {
      this.showToast("Veuillez remplir tous les champs", 'error');
      return;
    }

    if (!this.isValidEmail(this.form.email)) {
      this.showToast("Adresse email invalide", 'error');
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('name', this.form.name);
    formData.append('email', this.form.email);
    formData.append('subject', this.form.subject);
    formData.append('message', this.form.message);

    fetch('https://formsubmit.co/ajax/maximekpoghomou18@gmail.com', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    })
      .then(response => {
        if (response.ok) {
          form.resetForm();
          this.showToast('Message envoyé avec succès', 'success');
        } else {
          this.showToast("Erreur lors de l'envoi", 'error');
        }
      })
      .catch(() => {
        this.showToast("Échec de connexion. Vérifiez votre Internet.", 'error');
      })
      .finally(() => {
        this.loading = false;
        this.cd.detectChanges();
      });
  }

  // ==============================
  // 🔔 SNACKBAR ANGULAR MATERIAL
  // ==============================
  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success'
        ? ['snackbar-success']
        : ['snackbar-error']
    });

  }
}
