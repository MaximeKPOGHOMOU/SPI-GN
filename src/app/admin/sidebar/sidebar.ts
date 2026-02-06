import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatListModule,
    RouterModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {

  currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  showStaffLinks(): boolean {
    return this.currentUser && this.currentUser.role !== 'superviseur';
  }
}

