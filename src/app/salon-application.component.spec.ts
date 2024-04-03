import {TestBed} from '@angular/core/testing';
import { SalonApplication } from './salon-application.component';
import {LoginService} from "./service/login.service";
import {CredentialService} from "./service/credential.service";
import {SalonClient} from "./service/salon-client.service";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideHttpClient} from "@angular/common/http";
import {of} from "rxjs";
import {provideRouter} from "@angular/router";
import {salon_application_routes} from "src/app/routes";
import {PageService} from "./service/page.service";


describe('SalonApplication', () => {

  let loginService: LoginService;
  let page: PageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CredentialService,
        SalonClient,
        LoginService,
        PageService,
        provideHttpClientTesting(),
        provideHttpClient(),
        provideRouter(salon_application_routes)
      ]
    });

    loginService = TestBed.inject(LoginService);
    page = TestBed.inject(PageService);
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
    let routingSpy = spyOn(page, 'goHome');

    const fixture = TestBed.createComponent(SalonApplication);
    const app = fixture.componentInstance;

    fixture.detectChanges();

    expect(logoutSpy).toHaveBeenCalledTimes(0);
    expect(routingSpy).toHaveBeenCalledTimes(0);

    app.logout();

    fixture.detectChanges();

    expect(logoutSpy).toHaveBeenCalledOnceWith();
    expect(routingSpy).toHaveBeenCalledOnceWith();
  });
});
