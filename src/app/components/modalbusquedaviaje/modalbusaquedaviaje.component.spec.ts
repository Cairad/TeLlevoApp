import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalBusaquedaviajeComponent} from './modalbusaquedaviaje.component';

describe('ModallistaviajeComponent', () => {
  let component: ModalBusaquedaviajeComponent;
  let fixture: ComponentFixture<ModalBusaquedaviajeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBusaquedaviajeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalBusaquedaviajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
