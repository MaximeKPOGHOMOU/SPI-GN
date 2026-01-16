import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Info } from "../info/info";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-about',
  imports: [Header, Info, CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {

  showVision = false; // contrôle Lire plus / Lire moins pour la vision
  showMission = false; // contrôle Lire plus / Lire moins pour la mission
  showMore = false;
  showPresentation = false;



  services = [
    {
      name: 'SÉCURITÉ & GARDIENNAGE',
      description: 'Nos agents qualifiés assurent la protection de vos biens et locaux 24/7, pour une surveillance fiable et professionnelle.',
      image: 'assets/images/t1.jpg'
    },
    {
      name: 'GÉOLOCALISATION',
      description: 'Nous proposons des solutions GPS performantes pour vos véhicules et équipements, permettant un suivi précis et en temps réel.',
      image: 'assets/images/gps.jpg'
    },
    {
      name: 'SÉCURITÉ INCENDIE',
      description: 'Nos systèmes de sécurité incendie détectent rapidement les risques et assurent une intervention immédiate pour protéger vos locaux et collaborateurs.',
      image: 'assets/images/incendi.jpg'
    },
    {
      name: 'CONTRÔLE D’ACCÈS',
      description: 'Gestion des accès par badges, empreintes digitales ou codes, pour assurer la sécurité et le suivi des entrées dans vos locaux.',
      image: 'assets/images/control.png'
    },
    {
      name: 'VIDÉO SURVEILLANCE',
      description: 'Installation et gestion de caméras de surveillance pour garantir la sécurité de vos bâtiments et le suivi de vos activités.',
      image: 'assets/images/camera.jpg'
    },
    {
      name: 'PORTAIL MOTORISÉ',
      description: 'Solutions de portails motorisés sécurisés pour un contrôle d’accès pratique et fiable à vos propriétés.',
      image: 'assets/images/portail.jpg'
    }
  ];


  values = [
    {
      title: 'Intégrité',
      text: "Nous sommes engagés envers l’honnêteté, l’éthique et la transparence dans toutes nos interactions professionnelles."
    },
    {
      title: 'Innovation',
      text: "Nous restons à la pointe de la technologie pour offrir des solutions de sécurité de pointe."
    },
    {
      title: 'Engagement envers la Qualité',
      text: "Nous visons l’excellence dans tout ce que nous faisons."
    },
    {
      title: 'Service Client',
      text: "Nous sommes dévoués à la satisfaction de nos clients en offrant un service exceptionnel."
    }
  ];

  // Nombre de valeurs visibles avant clic "Lire plus"
  initialLimit = 2;

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  getDisplayedValues() {
    return this.showMore ? this.values : this.values.slice(0, this.initialLimit);
  }



  missionText = `Notre mission est de fournir les meilleures prestations de service aussi bien pour les particuliers que 
  pour les entités économiques. Développer nos services en fonction des besoins du client dans le strict 
  respect de ses exigences conformément aux principes de la sécurité.`;

  toggleMission() {
    this.showMission = !this.showMission;
  }

  truncate(text: string, limit: number, showFull: boolean) {
    return text.length > limit && !showFull ? text.slice(0, limit) + '...' : text;
  }





  visionText = `Notre vision est de devenir le leader en Guinée et en Afrique dans le domaine de la sécurité et du gardiennage, 
  en combinant technologie de pointe et expertise humaine. Nous aspirons à offrir à tous nos clients 
  une tranquillité d’esprit totale, en garantissant la sécurité des biens et des personnes de manière fiable, innovante et proactive.`;

  toggleVision() {
    this.showVision = !this.showVision;
  }

  // Fonction générique pour tronquer texte
  truncateVission(text: string, limit: number, showFull: boolean) {
    return text.length > limit && !showFull ? text.slice(0, limit) + '...' : text;
  }


  PresentationText = `la société sécurité prévention incendie-guinée (SPI-GN), est une entreprise spécialisée dans un large éventail de services, tels que la sécurité, le gardiennage, la sécurité incendie, la géolocalisation des véhicules, l'installation de caméras de surveillance, la gestion du temps de présence et d'accès par empreintes digitales, ainsi que de nombreux autres services. Forts d'une expérience de plusieurs années, nous sommes fiers de notre réputation en tant que fournisseur de solutions de sécurité fiables et innovantes.`;

  togglePresentation() {
    this.showPresentation = !this.showPresentation;
  }

  // Fonction générique pour tronquer texte
  truncatePresentation(text: string, limit: number, showFull: boolean) {
    return text.length > limit && !showFull ? text.slice(0, limit) + '...' : text;
  }


}
