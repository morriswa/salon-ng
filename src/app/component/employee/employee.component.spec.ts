import {EmployeeComponent} from "./employee.component";
import {LoginService} from "../../service/login.service";
import {provideRouter} from "@angular/router";
import {TestBed} from "@angular/core/testing";
import {CredentialService} from "../../service/credential.service";
import {SalonStore} from "../../service/salon-store.service";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideHttpClient} from "@angular/common/http";
import {salon_application_routes} from "src/app/routes";
import {of} from "rxjs";
import {PageService} from "../../service/page.service";
import {SalonClient} from "../../service/salon-client.service";


describe('EmployeeComponent', () => {

  let page: PageService;
  let loginService: LoginService;
  let salonClient: SalonStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
          EmployeeComponent
      ],
      providers: [
        CredentialService,
        SalonStore,
        SalonClient,
        LoginService,
        PageService,
        provideHttpClientTesting(),
        provideHttpClient(),
        provideRouter(salon_application_routes)
      ]
    }).compileComponents();

    page = TestBed.inject(PageService);
    loginService = TestBed.inject(LoginService);
    salonClient = TestBed.inject(SalonStore);
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(EmployeeComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should re-route unauthenticated requests', () => {

    let spyAuthenticated
      = spyOnProperty(loginService, 'authenticated', 'get').and.returnValue(false);
    let spyReroute = spyOn(page, 'change');
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

    let spyReroute = spyOn(page, 'goHome');

    let fixture = TestBed.createComponent(EmployeeComponent);
    let component = fixture.componentInstance;

    expect(component.firstName$).toBeUndefined();

    expect(spyAuthenticated).toHaveBeenCalledOnceWith();
    expect(spyIsEmployee).toHaveBeenCalledOnceWith('EMPLOYEE');
    expect(spyReroute).toHaveBeenCalledOnceWith();
    expect()
  });

  it('should initialize first name after authorization', () => {

    let spyAuthenticated
      = spyOnProperty(loginService, 'authenticated', 'get').and.returnValue(true);
    let spyIsEmployee
      = spyOn(loginService, 'hasAuthority').and.returnValue(true);

    let spyReroute = spyOn(page, "change");

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
    let spyReroute = spyOn(page, 'change');
    let spyGetEmployeeProfile
      = spyOn(salonClient, 'getCurrentEmployeeProfile').and.returnValue(of(
      {
        employeeId: 1,
        firstName: firstName,
        lastName: "",
        pronouns: "",
        formattedAddress: "",
        phoneNumber: "",
        email: "",
        contactPreference: "",
        profileImage: "",
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
