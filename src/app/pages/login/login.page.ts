import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  @ViewChild('modal') modal: any;

  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {}

  nextPage() {
    // Cierra el modal
    this.modalCtrl.dismiss();

    // Navega a la página deseada
    this.navCtrl.navigateForward('/home');
  }

  async login() {
    try {
      const result = await this.authService.login(this.email, this.password);
      this.modalCtrl.dismiss();

      // Navega a la página deseada
      this.navCtrl.navigateForward('/home');
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      // Manejar errores
    }
  }
}
