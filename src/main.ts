
/**
 * Salon UI Application Runner
 *
 * @author William A. Morris
 * @since 2024-02-02
 */

// NG
import {enableProdMode} from '@angular/core';
import {bootstrapApplication, provideProtractorTestingSupport} from "@angular/platform-browser";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideRouter} from "@angular/router";
import {provideHttpClient, withInterceptors, withXsrfConfiguration} from "@angular/common/http";

// Application Environment
import {environment} from 'src/environments/environment';

// Application Routes
import {salon_application_routes} from "src/app/routes";

// Http Interceptor
import {add_token_interceptor} from "src/app/add-token-interceptor";

// Core Application
import {SalonApplication} from "src/app/salon-application.component";

// Core Services
import {CredentialService} from "src/app/service/credential.service";
import {LoginService} from "src/app/service/login.service";
import {SalonStore} from "src/app/service/salon-store.service";
import {PageService} from "./app/service/page.service";
import {SalonClient} from "./app/service/salon-client.service";
import {xhr_interceptor} from "./app/xhr-interceptor";


// enables production mode for prod builds
if (environment.production) enableProdMode();
// bootstrap salon application
bootstrapApplication(SalonApplication,{
  providers: [
    // provide essential application services
    CredentialService,
    LoginService,
    PageService,
    SalonStore,
    SalonClient,
    // with angular animation, router, and http client
    provideProtractorTestingSupport(),
    provideRouter(salon_application_routes),
    provideHttpClient(
      withInterceptors([add_token_interceptor, xhr_interceptor]),
      withXsrfConfiguration({
        cookieName: "XSRF-TOKEN",
        headerName: "X-XSRF-TOKEN"
      })
    ),
    provideAnimations(),
  ],
// log all errors to the js console
}).catch(err => console.error(err));
