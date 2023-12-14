import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Viajes } from './../../interfaces/viajes';

@Component({
  selector: 'app-modallistaviaje',
  templateUrl: './modallistaviaje.component.html',
  styleUrls: ['./modallistaviaje.component.scss'],
})
export class ModallistaviajeComponent implements OnInit {
  viajes: Viajes[] = [];

  constructor(
    private modalController: ModalController,
    private firestoreService: FirestoreService,
  ) {}

  ngOnInit() {
    this.obtenerViajes();
  }

  async mostrarRuta(viaje: Viajes) {
    await this.modalController.dismiss(viaje);
  } 
  
  obtenerViajes() {
    this.firestoreService.obtenerViajes().subscribe((viajes) => {
      this.viajes = viajes;
    });
  }

  closeModal() {
    this.modalController.dismiss(); // Cierra el modal
  }

  
}
