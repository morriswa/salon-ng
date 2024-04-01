import { Component } from '@angular/core';
import {SalonClient} from "../../service/salon-client.service";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {CommonModule} from "@angular/common";
import {CarouselModule} from 'ngx-bootstrap/carousel'


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
    CarouselModule
  ]
})
export class HomeComponent {

  employees: any[] = [
    { title: 'Makenna Loewenherz', desc: 'dummy text dummy text dummy text. dummy text dummy text dummy text. dummy text dummy text dummy text. dummy text dummy text dummy text. dummy text dummy text dummy text. dummy text dummy text dummy text. dummy text dummy text dummy text.',
      image: 'assets/makenna_image.jpeg', },
    { title: 'William Morris', desc: 'dummy text dummy text dummy text. dummy text dummy text dummy text. dummy text dummy text dummy text. dummy text dummy text dummy text. dummy text dummy text dummy text. dummy text dummy text dummy text. dummy text dummy text dummy text.',
      image: 'assets/will_image.jpeg', },
    { title: 'Kevin Rivers', desc: 'dummy text dummy text dummy text. dummy text dummy text dummy text. dummy text dummy text dummy text. dummy text dummy text dummy text. dummy text dummy text dummy text. dummy text dummy text dummy text. dummy text dummy text dummy text.',
      image: 'assets/kevin_image.jpeg', },
  ]

  /**
   * controls template message displayed when service is accessed
   */
  message$: BehaviorSubject<string> = new BehaviorSubject<string>("");


  constructor(private salonClient: SalonClient, router: Router) {
    // if the user got rerouted, make sure url segment is correct
    router.navigate(['/'])
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
