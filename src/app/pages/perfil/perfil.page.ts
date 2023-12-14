// perfil.page.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  userProfile: any;
  profileForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
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

    // Deshabilitar el formulario al inicio
    this.profileForm.disable();
  }

  ngOnInit() {
    this.loadUserProfile();
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

  toggleEditMode() {
    if (this.isEditMode) {
      // Guardar los cambios en Firebase
      this.saveChanges();
    } else {
      // Habilitar el formulario para editar
      this.profileForm.enable();
    }

    // Alternar entre modos de edición y visualización
    this.isEditMode = !this.isEditMode;
  }

  async saveChanges() {
    try {
      // Obtener el uid del usuario actual
      const uid = this.userProfile.uid;

      // Actualizar el perfil en Firebase
      await this.authService.updateUserProfile({
        uid,
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        email: this.profileForm.value.email,
        phoneNumber: this.profileForm.value.phoneNumber,
        carDetails: {
          brand: this.profileForm.value.carDetails.brand,
          model: this.profileForm.value.carDetails.model,
        },
      });

      // Recargar el perfil después de guardar cambios
      await this.loadUserProfile();
    } catch (error) {
      console.error('Error al guardar los cambios en el perfil', error);
    } finally {
      // Deshabilitar el formulario después de guardar cambios
      this.profileForm.disable();
    }
  }
}
