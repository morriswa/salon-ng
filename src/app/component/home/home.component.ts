import { Component } from '@angular/core';
import {LoginService} from "../../service/login.service";
import {SalonClient} from "../../service/salon-client.service";


/**
 * Home page for the application
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  /**
   * controls template message displayed when service is accessed
   */
  message?: string;


  // component dependencies
  constructor(public loginService: LoginService, private salonClient: SalonClient) { }


  /**
   * verifies the web service is running
   */
  sayHi() { // when the user clicks 'Say Hi'
    // call web service's health check endpoint using salon client
    this.salonClient.healthCheck()
    .subscribe((response:string)=>{ // on success print message to screen
      this.message = response;
    })
  }

}
