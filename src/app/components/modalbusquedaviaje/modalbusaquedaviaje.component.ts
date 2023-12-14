import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Viajes } from '../../interfaces/viajes';

@Component({
  selector: 'app-modalbusaquedaviaje',
  templateUrl: './modalbusaquedaviaje.html',
  styleUrls: ['./modalbusaquedaviaje.component.scss'],
})
export class ModalBusaquedaviajeComponent implements OnInit {
  viajes: Viajes[] = [];
  todosLosViajes: Viajes[] = [];

  constructor(
    private modalController: ModalController,
    private firestoreService: FirestoreService,
  ) {}

  ngOnInit() {
    this.obtenerViajes();
  }

  obtenerViajes() {
    this.firestoreService.obtenerViajes().subscribe((viajes) => {
      this.viajes = viajes;
      this.todosLosViajes = viajes.slice();
    });
  }

  async mostrarRuta(viaje: Viajes) {
    // Agrega el viaje al historial de viajes en Firebase
    try {
      await this.firestoreService.agregarHistorialViaje(viaje);
      console.log('Viaje agregado al historial con éxito');
    } catch (error) {
      console.error('Error al agregar el viaje al historial', error);
    }

    await this.modalController.dismiss(viaje);
  }  

  closeModal() {
    this.modalController.dismiss();
  }
  

  buscarViajes(event: CustomEvent) {
    const textoBuscado = event.detail.value;

    if (!textoBuscado) {
      this.viajes = this.todosLosViajes.slice();
      return;
    }

    this.viajes = this.todosLosViajes.filter((viaje) =>
      viaje.nombre.toLowerCase().includes(textoBuscado.toLowerCase()) ||
      viaje.inicio.toLowerCase().includes(textoBuscado.toLowerCase()) ||
      viaje.destino.toLowerCase().includes(textoBuscado.toLowerCase())
    );
  }
}
