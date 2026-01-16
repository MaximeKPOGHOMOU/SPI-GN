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

  showMoreService = false;

  service = {
    title: 'Gardiennage & Suivi GPS',
    text: `SPI-GN assure un gardiennage humain qualifié et le suivi GPS de vos engins
    pour une sécurité globale. Nos agents expérimentés, accompagnés de solutions
    de suivi intelligentes, protègent vos biens tout en garantissant une gestion
    fiable et efficace.`
  };

  toggleText() {
    this.showMoreService = !this.showMoreService;
  }

  truncateGardinage(text: string, limit: number): string {
    if (this.showMoreService) return text;
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  }

  showMoreSecurity = false;

  securityService = {
    title: 'Sécurité électronique',
    text: `SPI-GN garantit une surveillance électronique complète grâce à des systèmes
  de vidéosurveillance et d’alarme de pointe. Notre technologie avancée, combinée
  à l’expertise de nos agents, permet un contrôle précis de vos locaux, offrant
  tranquillité et sécurité.`
  };

  toggleSecurityText() {
    this.showMoreSecurity = !this.showMoreSecurity;
  }

  truncateSecurity(text: string, limit: number): string {
    if (this.showMoreSecurity) return text;
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  }

  showMoreFire = false;

  fireService = {
    title: 'Sécurité incendie',
    text: `SPI-GN s’engage à fournir des solutions de sécurité incendie fiables et efficaces.
  Nos équipes qualifiées, associées à des équipements modernes, assurent la protection
  des biens et des personnes contre les risques d’incendie, avec une vigilance et une
  réactivité constantes.`
  };

  toggleFireText() {
    this.showMoreFire = !this.showMoreFire;
  }

    truncateFire(text: string, limit: number): string {
    if (this.showMoreFire) return text;
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  }





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
    { name: 'Maxime KPOGHOMOU', role: 'Responsable IT', image: 'assets/images/maxime.jpeg' },

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

  slides = [
  {
    title: 'Sécurité & Gardiennage',
    subtitle: 'Protection 24/7',
    text: 'Nos agents qualifiés assurent la sécurité de vos biens et locaux, pour une surveillance constante et fiable.'
  },
  {
    title: 'Vidéosurveillance',
    subtitle: 'Sécurité Électronique',
    text: 'Nous installons des systèmes de caméras modernes pour surveiller vos locaux et protéger vos espaces stratégiques.'
  },
  {
    title: 'Suivi GPS',
    subtitle: 'Gestion et Traçabilité',
    text: 'Nous proposons des solutions GPS pour vos véhicules et équipements, permettant un suivi précis et en temps réel.'
  },
  {
    title: 'Sécurité Incendie',
    subtitle: 'Secourisme',
    text: 'Nous proposons des solutions complètes de sécurité incendie pour protéger vos locaux et vos biens, avec installation et maintenance d’extincteurs.'
  }
];

}
