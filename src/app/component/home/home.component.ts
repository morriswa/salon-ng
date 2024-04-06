import { Component } from '@angular/core';
import {SalonStore} from "../../service/salon-store.service";
import {Observable} from "rxjs";
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

  featuredEmployees$: Observable<EmployeeProfile[]>;

  constructor(salonStore: SalonStore, public page: PageService) {
    // if the user got rerouted, make sure url segment is correct
    page.goHome();

    this.featuredEmployees$ = salonStore.getFeaturedEmployees();
  }

}
