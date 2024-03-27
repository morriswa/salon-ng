import {LoginService} from "../../service/login.service";
import {provideRouter, Router} from "@angular/router";
import {TestBed} from "@angular/core/testing";
import {CredentialService} from "../../service/credential.service";
import {SalonClient} from "../../service/salon-client.service";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideHttpClient} from "@angular/common/http";
import {salon_application_routes} from "../../../main";
import {LoginComponent} from "./login.component";
import {of} from "rxjs";


describe('LoginComponent', () => {

  let router: Router;
  let loginService: LoginService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
          LoginComponent
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

    router = TestBed.inject(Router);
    loginService = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should be initialized correctly', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    expect(component.loginMessage$.value).toBe("");
    expect(component.processingLogin$.value).toBe(false);
    expect(component.usernameForm.disabled).toBe(true);
    expect(component.passwordForm.disabled).toBe(true);

    fixture.detectChanges();

    expect(component.usernameForm.disabled).toBe(false);
    expect(component.passwordForm.disabled).toBe(false);
  });

  it('should re-route authorized employees', () => {

    let spyReroute = spyOn(router, 'navigate');
    let spyAuthenticated
      = spyOnProperty(loginService, 'authenticated', 'get').and.returnValue(true);
    let spyIsEmployee
      = spyOn(loginService, 'hasAuthority').and.returnValue(true);

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    expect(spyAuthenticated).toHaveBeenCalledOnceWith();
    expect(spyIsEmployee).toHaveBeenCalledOnceWith('EMPLOYEE');
    expect(spyReroute).toHaveBeenCalledOnceWith(['/employee', 'user']);
  });

  it('should re-route authorized clients', () => {

    let spyReroute = spyOn(router, 'navigate');
    let spyAuthenticated
      = spyOnProperty(loginService, 'authenticated', 'get').and.returnValue(true);
    let spyHasAuthority
      = spyOn(loginService, 'hasAuthority').and.returnValues(false, true);

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    expect(spyAuthenticated).toHaveBeenCalledOnceWith();
    expect(spyHasAuthority).toHaveBeenCalledWith('EMPLOYEE');
    expect(spyHasAuthority).toHaveBeenCalledWith('CLIENT');
    expect(spyHasAuthority).toHaveBeenCalledTimes(2);
    expect(spyReroute).toHaveBeenCalledOnceWith(['/client', 'user']);
  });

  it('should re-route new users', () => {

    let spyReroute = spyOn(router, 'navigate');
    let spyAuthenticated
      = spyOnProperty(loginService, 'authenticated', 'get').and.returnValue(true);
    let spyHasAuthority
      = spyOn(loginService, 'hasAuthority').and.returnValues(false, false);

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    expect(spyAuthenticated).toHaveBeenCalledOnceWith();
    expect(spyHasAuthority).toHaveBeenCalledWith('EMPLOYEE');
    expect(spyHasAuthority).toHaveBeenCalledWith('CLIENT');
    expect(spyHasAuthority).toHaveBeenCalledTimes(2);
    expect(spyReroute).toHaveBeenCalledOnceWith(['/register2']);
  });

  it('should NOT re-route unauthenticated users', () => {

    let spyReroute = spyOn(router, 'navigate');
    let spyAuthenticated
      = spyOnProperty(loginService, 'authenticated', 'get').and.returnValue(false);
    let spyHasAuthority
      = spyOn(loginService, 'hasAuthority');

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    expect(spyAuthenticated).toHaveBeenCalledOnceWith();
    expect(spyHasAuthority).toHaveBeenCalledTimes(0);
    expect(spyReroute).toHaveBeenCalledTimes(0);
  });

  it('should disable forms when processing', () => {

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    component.processingLogin$.next(true);

    fixture.detectChanges();

    expect(component.usernameForm.disabled).toBeTrue();
    expect(component.passwordForm.disabled).toBeTrue();
  });

  it('should re-enable forms when processing is complete', () => {

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    component.processingLogin$.next(true);

    fixture.detectChanges();

    expect(component.usernameForm.disabled).toBeTrue();
    expect(component.passwordForm.disabled).toBeTrue();

    component.processingLogin$.next(false);

    fixture.detectChanges();

    expect(component.usernameForm.disabled).toBeFalse();
    expect(component.passwordForm.disabled).toBeFalse();
  });

  it('should disable forms when attempting to login', () => {

    spyOn(loginService, 'login').and.returnValue(of(false));

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.login();

    fixture.detectChanges();

    expectAsync(()=>{
      component.login();
      expect(component.processingLogin$.value).toBeTrue();
      expect(component.usernameForm.disabled).toBeTrue();
      expect(component.passwordForm.disabled).toBeTrue();
    });

    expect(component.processingLogin$.value).toBeFalse();
    expect(component.usernameForm.disabled).toBeFalse();
    expect(component.passwordForm.disabled).toBeFalse();

    expect(component.loginMessage$.value).toBe("Could not authenticate with provided credentials!")
  });

  it('should re-route successfully authenticated employees', () => {

    spyOn(loginService, 'login').and.returnValue(of(true));
    spyOn(loginService, 'hasAuthority').and.returnValue(true);

    let spyRouter = spyOn(router, 'navigate');

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.login();

    fixture.detectChanges();

    expectAsync(()=>{
      component.login();
      expect(component.processingLogin$.value).toBeTrue();
      expect(component.usernameForm.disabled).toBeTrue();
      expect(component.passwordForm.disabled).toBeTrue();
    });

    expect(spyRouter).toHaveBeenCalledOnceWith(['/employee'])
  });

  it('should re-route successfully authenticated clients', () => {

    spyOn(loginService, 'login').and.returnValue(of(true));
    spyOn(loginService, 'hasAuthority').and.returnValues(false, true);

    let spyRouter = spyOn(router, 'navigate');

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.login();

    fixture.detectChanges();

    expectAsync(()=>{
      component.login();
      expect(component.processingLogin$.value).toBeTrue();
      expect(component.usernameForm.disabled).toBeTrue();
      expect(component.passwordForm.disabled).toBeTrue();
    });

    expect(spyRouter).toHaveBeenCalledOnceWith(['/client'])
  });

  it('should re-route successfully authenticated new users', () => {

    spyOn(loginService, 'login').and.returnValue(of(true));
    spyOn(loginService, 'hasAuthority').and.returnValues(false, false);

    let spyRouter = spyOn(router, 'navigate');

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.login();

    fixture.detectChanges();

    expectAsync(()=>{
      component.login();
      expect(component.processingLogin$.value).toBeTrue();
      expect(component.usernameForm.disabled).toBeTrue();
      expect(component.passwordForm.disabled).toBeTrue();
    });

    expect(spyRouter).toHaveBeenCalledOnceWith(['/register2'])
  });
});
