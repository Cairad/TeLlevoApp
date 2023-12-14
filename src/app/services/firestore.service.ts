import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Viajes } from './../interfaces/viajes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  guardarUser(user: any): Promise<any> {
    return this.firestore.collection('users').add(user);
  }

  agregarViaje(viaje: Viajes) {
    return this.firestore.collection('viajes').add(viaje);
  }
  
  obtenerViajes(): Observable<Viajes[]> {
    return this.firestore.collection<Viajes>('viajes').valueChanges();
  }

  agregarHistorialViaje(viaje: Viajes) {
    // Agrega el viaje a la colección "historialviajes" en Firestore
    return this.firestore.collection('historialviajes').add(viaje);
  }

  obtenerHistorialViajes(): Observable<Viajes[]> {
    return this.firestore.collection<Viajes>('historialviajes').valueChanges();
  }
  
}
