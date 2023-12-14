import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ModalviajeComponent } from './../../components/modalviaje/modalviaje.component';
import { ModallistaviajeComponent } from './../../components/modallistaviaje/modallistaviaje.component';
import { ModalBusaquedaviajeComponent } from './../../components/modalbusquedaviaje/modalbusaquedaviaje.component';
import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage,ModalviajeComponent,ModallistaviajeComponent,ModalBusaquedaviajeComponent]
  
})
export class HomePageModule {}
