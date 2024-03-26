import { TestBed } from '@angular/core/testing';
import { SalonApplication } from './salon-application.component';
import {LoginService} from "./service/login.service";
import {CredentialService} from "./service/credential.service";
import {SalonClient} from "./service/salon-client.service";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {HttpClient, provideHttpClient} from "@angular/common/http";

describe('SalonApplication', () => {


  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        SalonApplication
    ],
    providers: [
      LoginService,
      CredentialService,
      SalonClient,
      provideHttpClientTesting(),
      provideHttpClient()
    ]
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
    expect(app.loginService).toHaveBeenCalledOnceWith();
  });
});
