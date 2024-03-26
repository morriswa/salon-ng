import { TestBed } from '@angular/core/testing';
import { SalonApplication } from './salon-application.component';
import {LoginService} from "./service/login.service";
import {CredentialService} from "./service/credential.service";
import {SalonClient} from "./service/salon-client.service";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideHttpClient} from "@angular/common/http";
import {of} from "rxjs";
import {provideRouter, Router} from "@angular/router";
import {salon_application_routes} from "../main";


describe('SalonApplication', () => {

  let loginService: LoginService;
  let testRouter: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
          SalonApplication
      ],
      providers: [
        CredentialService,
        SalonClient,
        LoginService,
        provideHttpClientTesting(),
        provideHttpClient(),
        provideRouter(salon_application_routes)
      ]
    }).compileComponents();

    loginService = TestBed.inject(LoginService);
    testRouter = TestBed.inject(Router);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(SalonApplication);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize after authentication', () => {

    let loginSpy = spyOn(loginService, 'init').and.returnValue(of(true));

    const fixture = TestBed.createComponent(SalonApplication);
    const app = fixture.componentInstance;

    expect(app.ready$.value).toBe(false);

    fixture.detectChanges();

    expect(app.ready$.value).toBe(true);

    expect(loginSpy).toHaveBeenCalledOnceWith();
  });

  it('should initialize even if NOT authenticated', () => {

    let loginSpy = spyOn(loginService, 'init').and.returnValue(of(false));

    const fixture = TestBed.createComponent(SalonApplication);
    const app = fixture.componentInstance;

    expect(app.ready$.value).toBe(false);

    fixture.detectChanges();

    expect(app.ready$.value).toBe(true);

    expect(loginSpy).toHaveBeenCalledOnceWith();
  });

  it('should clear cache on logout', () => {

    let logoutSpy = spyOn(loginService, 'logout');
    let routingSpy = spyOn(testRouter, 'navigate');

    const fixture = TestBed.createComponent(SalonApplication);
    const app = fixture.componentInstance;

    fixture.detectChanges();

    expect(logoutSpy).toHaveBeenCalledTimes(0);
    expect(routingSpy).toHaveBeenCalledTimes(0);

    app.logout();

    fixture.detectChanges();

    expect(logoutSpy).toHaveBeenCalledOnceWith();
    expect(routingSpy).toHaveBeenCalledOnceWith(['/']);
  });
});
