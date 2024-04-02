// ng
import {Component, HostListener, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {RouterModule} from '@angular/router';
// other
import {BehaviorSubject} from "rxjs";
// services
import {LoginService} from "./service/login.service";
import {PageService} from "./service/page.service";


/**
 * Core application component loaded before every other page.
 * Provides login and routing capabilities to the user.
 *
 * @author William A. Morris
 * @since 2024-02-02
 */
@Component({
  selector: 'salon-application',
  templateUrl: './salon-application.component.html',
  styleUrls: ['./salon-application.component.scss'],
  standalone: true,
  imports: [
    // Required Angular Modules
    CommonModule,
    RouterModule,
    NgOptimizedImage,
  ]
})
export class SalonApplication implements OnInit {

  /**
   * state det. if application can be displayed
   */
  ready$: BehaviorSubject<boolean>;

  displayHeader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(public loginService: LoginService,
              public page: PageService) {
    this.ready$ = new BehaviorSubject<boolean>(false);
  }

  @HostListener("window:scroll", [])
  changeHeaderColor() {
    const number = document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.displayHeader$.next(number > 10);
  }

  ngOnInit(): void {
    this.loginService.init() // initialize the login service
      // application is ready after login service is initialized
      .subscribe(() => this.ready$.next(true));
  }


  /**
   * logs a user out of the application
   */
  logout(): void { // when user clicks logout
    // navigate back to start
    this.page.goHome();
    // initiate logout via service
    this.loginService.logout();
  }

}
