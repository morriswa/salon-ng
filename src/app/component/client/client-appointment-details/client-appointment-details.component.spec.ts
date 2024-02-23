import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAppointmentDetailsComponent } from './client-appointment-details.component';

describe('ClientAppointmentDetailsComponent', () => {
  let component: ClientAppointmentDetailsComponent;
  let fixture: ComponentFixture<ClientAppointmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAppointmentDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientAppointmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
