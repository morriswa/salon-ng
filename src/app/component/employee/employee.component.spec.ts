import {EmployeeComponent} from "./employee.component";
import {LoginService} from "../../service/login.service";
import {provideRouter, Router} from "@angular/router";
import {TestBed} from "@angular/core/testing";
import {CredentialService} from "../../service/credential.service";
import {SalonClient} from "../../service/salon-client.service";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideHttpClient} from "@angular/common/http";
import {salon_application_routes} from "src/app/routes";
import {of} from "rxjs";


describe('EmployeeComponent', () => {

  let router: Router;
  let loginService: LoginService;
  let salonClient: SalonClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
          EmployeeComponent
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
    salonClient = TestBed.inject(SalonClient);
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(EmployeeComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should re-route unauthenticated requests', () => {

    let spyAuthenticated
      = spyOnProperty(loginService, 'authenticated', 'get').and.returnValue(false);
    let spyReroute = spyOn(router, 'navigate');
    let spyIsEmployee
      = spyOn(loginService, 'hasAuthority').and.returnValue(false);

    TestBed.createComponent(EmployeeComponent);

    expect(spyAuthenticated).toHaveBeenCalledOnceWith();
    expect(spyIsEmployee).toHaveBeenCalledTimes(0);
    expect(spyReroute).toHaveBeenCalledOnceWith(['/login']);
  });

  it('should re-route authenticated requests from client', () => {

    let spyAuthenticated
      = spyOnProperty(loginService, 'authenticated', 'get').and.returnValue(true);

    let spyIsEmployee
      = spyOn(loginService, 'hasAuthority').and.returnValue(false);

    let spyReroute = spyOn(router, 'navigate');

    let fixture = TestBed.createComponent(EmployeeComponent);
    let component = fixture.componentInstance;

    expect(component.firstName$).toBeUndefined();

    expect(spyAuthenticated).toHaveBeenCalledOnceWith();
    expect(spyIsEmployee).toHaveBeenCalledOnceWith('EMPLOYEE');
    expect(spyReroute).toHaveBeenCalledOnceWith(['/']);
    expect()
  });

  it('should initialize first name after authorization', () => {

    let spyAuthenticated
      = spyOnProperty(loginService, 'authenticated', 'get').and.returnValue(true);
    let spyIsEmployee
      = spyOn(loginService, 'hasAuthority').and.returnValue(true);

    let spyReroute = spyOn(router, 'navigate');

    let fixture = TestBed.createComponent(EmployeeComponent);
    let component = fixture.componentInstance;

    expect(component.firstName$).toBeDefined();

    expect(spyAuthenticated).toHaveBeenCalledOnceWith();
    expect(spyIsEmployee).toHaveBeenCalledOnceWith('EMPLOYEE');
    expect(spyReroute).toHaveBeenCalledTimes(0);
  });

  it('should retrieve employees first name', () => {

    const firstName = "testing testing 123";

    let spyAuthenticated
      = spyOnProperty(loginService, 'authenticated', 'get').and.returnValue(true);
    let spyIsEmployee
      = spyOn(loginService, 'hasAuthority').and.returnValue(true);
    let spyReroute = spyOn(router, 'navigate');
    let spyGetEmployeeProfile
      = spyOn(salonClient, 'getEmployeeProfile').and.returnValue(of(
      {
        firstName: firstName,
        lastName: "",
        pronouns: "",
        formattedAddress: "",
        phoneNumber: "",
        email: "",
        contactPreference: "",
        profileImage: ""
      }
    ));

    let fixture = TestBed.createComponent(EmployeeComponent);
    let component = fixture.componentInstance;

    expect(component.firstName$).toBeDefined();

    expect(spyAuthenticated).toHaveBeenCalledOnceWith();
    expect(spyIsEmployee).toHaveBeenCalledOnceWith('EMPLOYEE');
    expect(spyReroute).toHaveBeenCalledTimes(0);
    expect(spyGetEmployeeProfile).toHaveBeenCalledOnceWith();

    fixture.detectChanges();

    expectAsync(component.firstName$!.subscribe((res)=>{
      expect(res).toBe(firstName);
    }));
  });


});
