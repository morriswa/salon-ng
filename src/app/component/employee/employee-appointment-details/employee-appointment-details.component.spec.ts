import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAppointmentDetailsComponent } from './employee-appointment-details.component';

describe('EmployeeAppointmentDetailsComponent', () => {
  let component: EmployeeAppointmentDetailsComponent;
  let fixture: ComponentFixture<EmployeeAppointmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAppointmentDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeAppointmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
