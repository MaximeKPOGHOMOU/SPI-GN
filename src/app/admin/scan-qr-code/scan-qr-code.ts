import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-scan-qr-code',
  standalone: true,
  imports: [
    CommonModule,
    ZXingScannerModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule
],
  templateUrl: './scan-qr-code.html',
  styleUrls: ['./scan-qr-code.css'],
})
export class ScanQrCode implements OnInit {

  scannedResult: string = '';
  hasDevices = false;
  hasPermission = false;
  selectedDevice: MediaDeviceInfo | undefined;
  scannerActive = false;
  currentUser: any = null;
  loading = false;  // <-- nouveau

  constructor(
    private router: Router,
    private supabase: SupabaseService,
     private cdr: ChangeDetectorRef,
    private snack: MatSnackBar
  ) {
    const user = localStorage.getItem('user');
    if (user) this.currentUser = JSON.parse(user);
  }
  ngOnInit(): void {
     this.cdr.detectChanges();
  }

async handleQrCodeResult(result: string) {
  this.scannerActive = false;

  const siteId = parseInt(result, 10);
  if (isNaN(siteId)) {
    this.showToast('QR code invalide', 'error');
    return;
  }

  this.scannedResult = `Site ID : ${siteId}`;
  this.loading = true;  // 🔹 démarrer le spinner

  if (this.currentUser && this.currentUser.id) {
    try {
      await this.supabase.insertScan(this.currentUser.id, siteId); // UUID agent
      this.showToast('Scan enregistré avec succès', 'success');
    } catch (err: any) {
      console.error('Erreur insertion scan', err);
      this.showToast(`Erreur : ${err.message}`, 'error');
    } finally {
      this.loading = false; // 🔹 arrêter le spinner

      // 🔹 rafraîchir le DOM
      this.cdr.detectChanges();
    }
  } else {
    this.loading = false;
    this.cdr.detectChanges(); // 🔹 s’assurer que le spinner disparaît
    this.showToast('Utilisateur non connecté', 'error');
  }
}



  startScanner() {
    this.scannerActive = true;
    this.scannedResult = '';
  }

  resetScanner() {
    this.scannedResult = '';
    this.scannerActive = false;
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.hasDevices = true;
    this.selectedDevice = devices[0];
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.snack.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error'],
    });
  }
}
