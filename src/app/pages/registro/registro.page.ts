import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  userDetails = {
    email: '',
    password: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    isDriver: false,
    carDetails: {
      brand: '',
      model: '',
    },
  };

  constructor(
    private authService: AuthService,
    private router: Router) {}

    async register() {
      try {
        const result = await this.authService.register({
          email: this.userDetails.email,
          password: this.userDetails.password,
          phoneNumber: this.userDetails.phoneNumber,
          firstName: this.userDetails.firstName,
          lastName: this.userDetails.lastName,
          isDriver: this.userDetails.isDriver,
          carDetails: this.userDetails.isDriver ? this.userDetails.carDetails : null,
        });
    
        if (result.user) {
          // Obtener el UID del usuario registrado
          const uid = result.user.uid;
    
          // Llamar a la función para crear el perfil del usuario
          await this.authService.createUserProfile(uid, {
            email: this.userDetails.email,
            isDriver: this.userDetails.isDriver,
            firstName: this.userDetails.firstName,
            lastName: this.userDetails.lastName,
            phoneNumber: this.userDetails.phoneNumber,
            carDetails: this.userDetails.isDriver ? this.userDetails.carDetails : null,
          });
    
          // Consultar el perfil del usuario después de crearlo
          const userDoc = await this.authService.getUserProfile(uid);
    
          // Acceder al rol del usuario
          const userRole = userDoc?.role;
          console.log('Rol del usuario:', userRole);
    
          this.isRegistrarVisible = false;
          this.router.navigate(['/login']);
        } else {
          console.error('No se pudo obtener el UID del usuario registrado.');
        }
      } catch (error) {
        console.error('Error al registrar el usuario', error);
      }
    }
    
    
    
  
  
  
  updateRegistrarVisibility() {
    this.isRegistrarVisible = !this.userDetails.isDriver;
  }
  
  isRegistrarVisible = true;
  
  

  currentStep = 1;

  nextStep() {
    // Lógica para avanzar al siguiente paso
    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }

  goBack() {
    // Lógica para retroceder
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}
