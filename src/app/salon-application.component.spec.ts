import { TestBed } from '@angular/core/testing';
import { SalonApplication } from './salon-application.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        SalonApplication
    ],
}).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(SalonApplication);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call login init', () => {
    const fixture = TestBed.createComponent(SalonApplication);
    const app = fixture.componentInstance;
    expect(app.loginService.init).toHaveBeenCalledOnceWith();
  });
});
