import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { icon, Map, tileLayer, marker } from 'leaflet';
import { Viajes } from './../../interfaces/viajes';
import { ModalController } from '@ionic/angular';
import { ModalviajeComponent } from './../../components/modalviaje/modalviaje.component';
import { ModallistaviajeComponent } from './../../components/modallistaviaje/modallistaviaje.component';
import { ModalBusaquedaviajeComponent } from './../../components/modalbusquedaviaje/modalbusaquedaviaje.component';
import * as L from 'leaflet';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private map: any;
  handlerMessage = '';
  esChofer: boolean = false;
  userProfile: any | null = null;
  isSearchBarActive = false;
  buttonStyle = {};
  viajes: Viajes[] = [];

  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private modalController: ModalController,
    private FirestoreService: FirestoreService
  ) {}

  // Pasajero - Chofer
  async ngOnInit() {
    this.userProfile = await this.authService.getCurrentUser();
    this.esChofer = await this.checkIfChofer();
    this.initializeMap();

    this.FirestoreService.obtenerViajes().subscribe((viajes) => {
      this.viajes = viajes;
    });
  }

  toggleSearchBar() {
    this.isSearchBarActive = !this.isSearchBarActive;

    this.buttonStyle = this.isSearchBarActive
      ? { 'margin-bottom': '60px' }
      : {};
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalviajeComponent,
    });

    modal.onDidDismiss().then((data) => {
      // Acciones después de cerrar el modal (si es necesario)
      console.log('Modal de creacion de viajes cerrado', data);
    });

    await modal.present();
  }

  async openModal2() {
    const modal = await this.modalController.create({
      component: ModallistaviajeComponent,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        const viajeSeleccionado = data.data as Viajes;
        this.mostrarRutaEnMapa(viajeSeleccionado);
      }
      console.log('Modal de lista de viajes cerrado', data);
    });

    await modal.present();
  }

  async openModal3() {
    const modal = await this.modalController.create({
      component: ModalBusaquedaviajeComponent,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        const viajeSeleccionado = data.data as Viajes;
        this.mostrarRutaEnMapa(viajeSeleccionado);
      }
      console.log('Modal de lista de viajes cerrado', data);
    });

    await modal.present();
  }

  async checkIfChofer(): Promise<boolean> {
    try {
      const user = await this.authService.getCurrentUser();
      return user?.esChofer || false;
    } catch (error) {
      console.error('Error al obtener la información del usuario', error);
      return false;
    }
  }

  // Mapa

  initializeMap() {
    // Configuración inicial del mapa
    this.map = new Map('map').setView([-33.5985866, -70.579071], 13); // Latitud y longitud iniciales y nivel de zoom

    // Capa de mosaico (puedes usar otros proveedores como OpenStreetMap)
    tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Configurar el icono personalizado
    const customIcon = icon({
      iconUrl: '/assets/img/markicon.png', // Ruta de la imagen del icono personalizado
      iconSize: [32, 32], // Tamaño del icono [ancho, alto]
      iconAnchor: [16, 32], // Punto de anclaje del icono en relación con su posición
      popupAnchor: [0, -32], // Punto de anclaje del popup en relación con su posición
    });

    // Añadir marcador de ejemplo con icono personalizado
    marker([-33.5985866, -70.579071], { icon: customIcon })
      .addTo(this.map)
      .bindPopup('Ejemplo de marcador con icono personalizado');
  }

  mostrarRutaEnMapa(viaje: Viajes) {
    // Limpiar marcadores y ruta existentes
    this.map.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        this.map.removeLayer(layer);
      }
    });

    // Agregar marcador para el inicio
    const inicioMarker = L.marker(
      viaje.coordenadasInicio
        .split(',')
        .map((coord) => parseFloat(coord)) as L.LatLngExpression,
      { icon: this.getCustomIcon() } // Usa la función getCustomIcon para obtener el icono personalizado
    ).addTo(this.map);
    inicioMarker.bindPopup('Inicio: ' + viaje.inicio);

    // Agregar marcador para el destino
    const destinoMarker = L.marker(
      viaje.coordenadasDestino
        .split(',')
        .map((coord) => parseFloat(coord)) as L.LatLngExpression,
      { icon: this.getCustomIcon() } // Usa la función getCustomIcon para obtener el icono personalizado
    ).addTo(this.map);
    destinoMarker.bindPopup('Destino: ' + viaje.destino);

    // Trazar la ruta
    const ruta = L.polyline([
      viaje.coordenadasInicio
        .split(',')
        .map((coord) => parseFloat(coord)) as L.LatLngExpression,
      viaje.coordenadasDestino
        .split(',')
        .map((coord) => parseFloat(coord)) as L.LatLngExpression,
    ], { color: '#4f4ac2' }).addTo(this.map);

    // Resto de la lógica...
  }

  getCustomIcon() {
    // Configura el icono personalizado si lo necesitas
    return L.icon({
      iconUrl: '/assets/img/markicon.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }
  // LogOut

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de querer cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Cerrar Sesión Cancelado';
          },
        },
        {
          text: 'Estoy seguro',
          role: 'confirm',
          handler: async () => {
            this.router.navigateByUrl('/login', { replaceUrl: true });
          },
        },
      ],
      mode: 'ios',
    });
    await alert.present();
  }
}
