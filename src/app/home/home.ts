import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CountUp } from 'countup.js';

import { Info } from '../info/info';
import { Header } from '../header/header';

 declare var PureCounter: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [CommonModule, RouterModule, Info, Header, FormsModule],
})
export class Home implements AfterViewInit {


  // ======================
  // Variables affichage textes
  // ======================
  showMoreService = false;
  showPresentation = false;
  showMoreSecurity = false;
  showMoreFire = false;

  PresentationText = `SPI-GN est une entreprise spécialisée dans la sécurité & gardiennage, la sécurité incendie, la
            géolocalisation, l’installation de caméras de surveillance, la gestion du temps de présence et d’accès par
            empreintes digitales, ainsi que de nombreux autres services.`;

  service = {
    title: 'Gardiennage & Suivi GPS',
    text: `SPI-GN assure un gardiennage humain qualifié et le suivi GPS de vos engins
    pour une sécurité globale. Nos agents expérimentés, accompagnés de solutions
    de suivi intelligentes, protègent vos biens tout en garantissant une gestion
    fiable et efficace.`
  };

  securityService = {
    title: 'Sécurité électronique',
    text: `SPI-GN garantit une surveillance électronique complète grâce à des systèmes
  de vidéosurveillance et d’alarme de pointe. Notre technologie avancée, combinée
  à l’expertise de nos agents, permet un contrôle précis de vos locaux, offrant
  tranquillité et sécurité.`
  };

  fireService = {
    title: 'Sécurité incendie',
    text: `SPI-GN s’engage à fournir des solutions de sécurité incendie fiables et efficaces.
  Nos équipes qualifiées, associées à des équipements modernes, assurent la protection
  des biens et des personnes contre les risques d’incendie, avec une vigilance et une
  réactivité constantes.`
  };

  // ======================
  // Clients et gardes
  // ======================
  clients = [
    { name: 'BANQUE CENTRALE DE LA REPUBLIQUE DE GUINEE', description: 'Client fidèle bénéficiant de nos services de gardiennage et electronique.', image: 'assets/images/bcrg.png' },
    { name: 'GUITER S.A', description: 'Client fidèle bénéficiant de nos services de gardiennage.', image: 'assets/images/guitter.jpg' },
    { name: 'BURVAL CORPORATE S.A GUINEE', description: 'Client fidèle bénéficiant de nos services de gardiennage.', image: 'assets/images/burval.jpg' }
  ];

  guards = [
    { name: 'Sékou SOUMAHORO', role: 'Président directeur général ', image: 'assets/images/dg.jpg' },
    { name: 'Ousmane TOURE', role: 'Directeur général adjoint', image: 'assets/images/dga.jpg' },
    { name: 'Maxime KPOGHOMOU', role: 'Responsable IT', image: 'assets/images/maxime.jpeg' }
  ];

  // ======================
  // Formulaire contact
  // ======================
  form = { name: '', email: '', subject: '', message: '' };
  loading = false;

  // ======================
  // Slides
  // ======================
  slides = [
    { title: 'Sécurité & Gardiennage', subtitle: 'Protection 24/7', text: 'Nos agents qualifiés assurent la sécurité de vos biens et locaux, pour une surveillance constante et fiable.' },
    { title: 'Vidéosurveillance', subtitle: 'Sécurité Électronique', text: 'Nous installons des systèmes de caméras modernes pour surveiller vos locaux et protéger vos espaces stratégiques.' },
    { title: 'Suivi GPS', subtitle: 'Gestion et Traçabilité', text: 'Nous proposons des solutions GPS pour vos véhicules et équipements, permettant un suivi précis et en temps réel.' },
    { title: 'Sécurité Incendie', subtitle: 'Secourisme', text: 'Nous proposons des solutions complètes de sécurité incendie pour protéger vos locaux, avec installation et maintenance d’extincteurs.' }
  ];

  // ======================
  // Constructeur
  // ======================
  constructor(private cd: ChangeDetectorRef, private snackBar: MatSnackBar) { }
  ngAfterViewInit(): void {

  new PureCounter();
  }

  // ======================
  // Cycle Angular
  // ======================
  ngOnInit(): void {
    this.resetForm();
  }
  

  // ======================
  // Fonctions utilitaires
  // ======================
  togglePresentation() { this.showPresentation = !this.showPresentation; }
  toggleText() { this.showMoreService = !this.showMoreService; }
  toggleSecurityText() { this.showMoreSecurity = !this.showMoreSecurity; }
  toggleFireText() { this.showMoreFire = !this.showMoreFire; }

  truncatePresentation(text: string, limit: number, showFull: boolean) { return text.length > limit && !showFull ? text.slice(0, limit) + '...' : text; }
  truncateGardinage(text: string, limit: number) { return this.showMoreService ? text : text.length > limit ? text.slice(0, limit) + '...' : text; }
  truncateSecurity(text: string, limit: number) { return this.showMoreSecurity ? text : text.length > limit ? text.slice(0, limit) + '...' : text; }
  truncateFire(text: string, limit: number) { return this.showMoreFire ? text : text.length > limit ? text.slice(0, limit) + '...' : text; }

  resetForm() { this.form = { name: '', email: '', subject: '', message: '' }; this.loading = false; }
  isValidEmail(email: string): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

onSubmit(form: NgForm) {
  // 1️⃣ Vérification des champs
  if (!this.form.name.trim() || !this.form.email.trim() || !this.form.subject.trim() || !this.form.message.trim()) {
    this.showToast("Veuillez remplir tous les champs", 'error');
    return;
  }

  // 2️⃣ Vérification de l'email
  if (!this.isValidEmail(this.form.email)) {
    this.showToast("Adresse email invalide", 'error');
    return;
  }

  // 3️⃣ Indiquer que le formulaire est en cours d'envoi
  this.loading = true;

  // 4️⃣ Préparer les données
  const formData = new FormData();
  Object.keys(this.form).forEach(key => {
    formData.append(key, this.form[key as keyof typeof this.form]);
  });

  // 5️⃣ Envoi via fetch
  fetch('https://formsubmit.co/ajax/contact@spi-gn.com', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: formData
  })
  .then(res => {
    // ✅ Si tout s'est bien passé
    if (res.ok) {
      form.resetForm(); // reset formulaire
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
    this.cd.detectChanges(); // mise à jour Angular
  });
}


  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }

 


}

