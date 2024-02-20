import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSearchServicesComponent } from './client-search-services.component';

describe('ClientSearchServicesComponent', () => {
  let component: ClientSearchServicesComponent;
  let fixture: ComponentFixture<ClientSearchServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSearchServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientSearchServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
