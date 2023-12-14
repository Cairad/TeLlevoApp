import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { Viajes } from 'src/app/interfaces/viajes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  mostrarDetalles = false;
  alturaViaje = 'auto';
  iconoBoton = 'chevron-down-outline';
  historialViajes: Viajes[] = [];
  profileForm: FormGroup;
  userProfile: any;

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      carDetails: this.fb.group({
        brand: ['', Validators.required],
        model: ['', Validators.required],
      }),
    });
  }

  ngOnInit() {
    // Llamada al servicio para obtener el historial de viajes
    this.firestoreService.obtenerHistorialViajes().subscribe((viajes) => {
      this.historialViajes = viajes;
    });
  }

  toggleDetalles() {
    this.mostrarDetalles = !this.mostrarDetalles;
    this.alturaViaje = this.mostrarDetalles ? 'auto' : '50%';
    this.iconoBoton = this.mostrarDetalles
      ? 'chevron-up-outline'
      : 'chevron-down-outline';

    // Asegúrate de que el contenedor .viaje vuelva a su altura original cuando se ocultan los detalles
    if (!this.mostrarDetalles) {
      this.alturaViaje = 'auto';
    }
  }

  async loadUserProfile() {
    try {
      this.userProfile = await this.authService.getCurrentUser();

      // Asignar valores del usuario al formulario
      this.profileForm.patchValue({
        firstName: this.userProfile.firstName,
        lastName: this.userProfile.lastName,
        email: this.userProfile.email,
        phoneNumber: this.userProfile.phoneNumber,
        carDetails: {
          brand: this.userProfile.carDetails?.brand || '',
          model: this.userProfile.carDetails?.model || '',
        },
      });
    } catch (error) {
      console.error('Error al cargar el perfil del usuario', error);
    }
  }
}
