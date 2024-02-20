import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientServiceAndBookingComponent } from './client-service-and-booking.component';

describe('ClientServiceAndBookingComponent', () => {
  let component: ClientServiceAndBookingComponent;
  let fixture: ComponentFixture<ClientServiceAndBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientServiceAndBookingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientServiceAndBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
