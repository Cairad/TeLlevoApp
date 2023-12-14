import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private firestore: AngularFirestore
  ) {}

  //registro

  async register(userDetails: any) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        userDetails.email,
        userDetails.password
      );

      return result;
    } catch (error) {
      console.error('Error al registrar el usuario', error);
      throw error;
    }
  }

  async createUserProfile(uid: string, userData: any) {
    const userDoc = this.firestore.collection('users').doc(uid);

    try {
      // Verificar si el documento ya existe antes de crearlo
      const docSnapshot = await userDoc.get().toPromise(); // Agregamos toPromise para convertirlo en una promesa
      if (!docSnapshot!.data()) {
        await userDoc.set({
          email: userData.email,
          isDriver: userData.isDriver,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber,
          carDetails: userData.isDriver ? userData.carDetails : null,
          role: userData.isDriver ? 'chofer' : 'pasajero',
        });
      }

      return {
        success: true,
        message: 'Perfil de usuario creado correctamente.',
      };
    } catch (error) {
      console.error('Error al crear el perfil de usuario:', error);
      return {
        success: false,
        message: 'Error al crear el perfil de usuario.',
      };
    }
  }

  async getUserProfile(uid: string): Promise<any> {
    const userDoc = await this.firestore
      .collection('users')
      .doc(uid)
      .get()
      .toPromise();
    return userDoc!.data();
  }

  getDatabase() {
    return this.afDatabase;
  }

  //Login

  async login(email: string, password: string): Promise<any> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );

      if (result.user) {
        // Obtener información del usuario directamente desde Firestore
        const userProfile = await this.getUserProfile(result.user.uid);

        if (userProfile) {
          // Imprime información del usuario en la consola
          console.log('Información del usuario:', userProfile);

          // Realiza acciones específicas dependiendo del tipo de usuario
          if (userProfile.isDriver) {
            console.log('El usuario es un chofer.');
            // Puedes redirigir a una página específica para chofer
          } else {
            console.log('El usuario es un pasajero.');
            // Puedes redirigir a la página principal para pasajero
          }
        }
      }

      return result;
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      throw error;
    }
  }

  logout(): Promise<any> {
    return this.afAuth.signOut();
  }

  //Perfil

  async getCurrentUser(): Promise<any> {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userProfile = await this.getUserProfile(user.uid);
        return userProfile;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el usuario actual', error);
      throw error;
    }
  }

  // AuthService (auth.service.ts)

  async updateUserProfile(userData: {
    uid: string;
    [key: string]: any;
  }): Promise<void> {
    const { uid, ...data } = userData;
    return this.firestore.collection('users').doc(uid).update(data);
  }
}
