import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfileComponentComponent } from './create-profile-component.component';

describe('CreateProfileComponentComponent', () => {
  let component: CreateProfileComponentComponent;
  let fixture: ComponentFixture<CreateProfileComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProfileComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateProfileComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
