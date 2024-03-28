import {LoginService} from "../../service/login.service";
import {provideRouter, Router} from "@angular/router";
import {TestBed} from "@angular/core/testing";
import {CredentialService} from "../../service/credential.service";
import {SalonClient} from "../../service/salon-client.service";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideHttpClient} from "@angular/common/http";
import {salon_application_routes} from "src/app/routes";
import {ClientComponent} from "./client.component";


describe('ClientComponent', () => {

  let router: Router;
  let loginService: LoginService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
          ClientComponent
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
    const fixture = TestBed.createComponent(ClientComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should re-route unauthenticated requests', () => {

    let spyAuthenticated
      = spyOnProperty(loginService, 'authenticated', 'get').and.returnValue(false);
    let spyReroute = spyOn(router, 'navigate');
    let spyIsClient
      = spyOn(loginService, 'hasAuthority').and.returnValue(false);

    TestBed.createComponent(ClientComponent);

    expect(spyAuthenticated).toHaveBeenCalledOnceWith();
    expect(spyIsClient).toHaveBeenCalledTimes(0);
    expect(spyReroute).toHaveBeenCalledOnceWith(['/login']);
  });

  it('should re-route authenticated requests from employees', () => {

    let spyAuthenticated
      = spyOnProperty(loginService, 'authenticated', 'get').and.returnValue(true);

    let spyIsClient
      = spyOn(loginService, 'hasAuthority').and.returnValue(false);

    let spyReroute = spyOn(router, 'navigate');

    TestBed.createComponent(ClientComponent);

    expect(spyAuthenticated).toHaveBeenCalledOnceWith();
    expect(spyIsClient).toHaveBeenCalledOnceWith('CLIENT');
    expect(spyReroute).toHaveBeenCalledOnceWith(['/login']);
  });

});
