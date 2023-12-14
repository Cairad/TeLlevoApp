import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Viajes } from './../../interfaces/viajes';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-modalviaje',
  templateUrl: './modalviaje.component.html',
  styleUrls: ['./modalviaje.component.scss'],
})
export class ModalviajeComponent {
  nuevoViaje : Viajes = {
    nombreChofer: '',
    nombre: '',
    inicio: '',
    coordenadasInicio: '',
    destino: '',
    coordenadasDestino: '',
    tarifa: 0,
    tiempo: '',
    asientos: 0,
  };

  constructor(
    private modalController: ModalController,
    private FirestoreService: FirestoreService
  ) {}

  guardarViaje() {
    this.FirestoreService.agregarViaje(this.nuevoViaje).then(() => {
      this.nuevoViaje = {
        nombreChofer: '',
        nombre: '',
        inicio: '',
        coordenadasInicio: '',
        destino: '',
        coordenadasDestino: '',
        tarifa: 0,
        tiempo: '',
        asientos: 0,
      };
      this.modalController.dismiss();
    });
  }

  closeModal() {
    this.modalController.dismiss(); // Cierra el modal
  }
}
