import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./footer/footer";
import { Header } from "./header/header";
import { CommonModule, NgIf } from '@angular/common';
import { Sidebar } from "./admin/sidebar/sidebar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SPI-GN');

   showScrollBtn = false;

  // Écoute le scroll de la fenêtre
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollBtn = window.scrollY > 200;
  }

  // Action au clic
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
