import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeServicesComponent } from './employee-services.component';

describe('ProvidedServiceComponent', () => {
  let component: EmployeeServicesComponent;
  let fixture: ComponentFixture<EmployeeServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
