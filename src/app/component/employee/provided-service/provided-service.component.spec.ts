import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidedServiceComponent } from './provided-service.component';

describe('ProvidedServiceComponent', () => {
  let component: ProvidedServiceComponent;
  let fixture: ComponentFixture<ProvidedServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvidedServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProvidedServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
