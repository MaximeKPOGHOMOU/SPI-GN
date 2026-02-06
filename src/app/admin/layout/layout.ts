import { Component } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { RouterOutlet } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Sidebar, RouterOutlet,CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

  currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  isSuperviseur(): boolean {
    return this.currentUser?.role === 'superviseur';
  }

  showSidebar(): boolean {
    return !!this.currentUser && !this.isSuperviseur();
  }
}
