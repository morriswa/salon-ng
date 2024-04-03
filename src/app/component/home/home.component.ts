import { Component } from '@angular/core';
import {SalonClient} from "../../service/salon-client.service";
import {BehaviorSubject, Observable} from "rxjs";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {EmployeeProfile} from "../../interface/profile.interface";
import {PageService} from "../../service/page.service";


/**
 * Home page for the application
 */
@Component({
  selector: 'salon-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [
    CommonModule,

    NgOptimizedImage
  ]
})
export class HomeComponent {

  /**
   * controls template message displayed when service is accessed
   */
  message$: BehaviorSubject<string> = new BehaviorSubject<string>("");

  featuredEmployees$: Observable<EmployeeProfile[]>;

  constructor(private salonClient: SalonClient, page: PageService) {
    // if the user got rerouted, make sure url segment is correct
    page.goHome();

    this.featuredEmployees$ = salonClient.getFeaturedEmployees();
  }


  /**
   * verifies the web service is running
   */
  sayHi() { // when the user clicks 'Say Hi'
    // call web service's health check endpoint using salon client
    this.salonClient.healthCheck()
    .subscribe((response:string)=>{ // on success print message to screen
      this.message$.next(response);
    })
  }

}
