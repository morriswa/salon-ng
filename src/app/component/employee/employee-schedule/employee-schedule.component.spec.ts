import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeScheduleComponent } from './employee-schedule.component';

describe('EmployeeScheduleComponent', () => {
  let component: EmployeeScheduleComponent;
  let fixture: ComponentFixture<EmployeeScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeScheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
