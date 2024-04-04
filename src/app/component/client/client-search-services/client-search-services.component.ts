import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {SalonClient} from "../../../service/salon-client.service";
import {BehaviorSubject, Observable, of, switchMap, tap} from "rxjs";
import {CommonModule} from "@angular/common";
import {ValidatorFactory} from "../../../validator-factory";
import {PageService} from "../../../service/page.service";
import {ProvidedServiceDetails} from "../../../interface/provided-service.interface";

type TAB_SELECTOR = 'hair'|'nail'|'other';
type TAB = { title: string, selector: TAB_SELECTOR };
const DEFAULT_TAB: TAB_SELECTOR = 'hair';

/**
 * add tabs here
 */
const TABS: TAB[] = [
  {title: 'Hair', selector: 'hair'},
  {title: 'Nails', selector: 'nail'},
  {title: 'Other', selector: 'other'},
]

@Component({
  selector: 'salon-client-search-services',
  templateUrl: './client-search-services.component.html',
  styleUrl: './client-search-services.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class ClientSearchServicesComponent {

  /**
   * translate const to class attr
   */
  tabs = TABS;

  /**
   * emits list of current service details to display
   */
  searchResults$: BehaviorSubject<ProvidedServiceDetails[]>
    = new BehaviorSubject<ProvidedServiceDetails[]>([]);

  /**
   * emits which tab the user is currently viewing
   */
  currentPage$: BehaviorSubject<TAB_SELECTOR>
    = new BehaviorSubject<TAB_SELECTOR>(DEFAULT_TAB);

  /**
   * emits whether the component is in a loading state
   */
  loading$: BehaviorSubject<boolean>
    = new BehaviorSubject<boolean>(true);



  searchServiceForm: FormControl = ValidatorFactory.getGenericForm();


  constructor(private salonClient: SalonClient, public page: PageService) {

    this.salonClient.searchAvailableServices(this.currentPage$.value)
      .subscribe({
        next: res=>{
          this.searchResults$.next(res);
        }
      });

    this.currentPage$.asObservable()
      .pipe(
        tap(()=>this.loading$.next(true)),
        switchMap((res): Observable<ProvidedServiceDetails[]>=>{
          switch (res) {
            case 'hair':
              return this.salonClient.searchAvailableServices('hair')
                .pipe(tap(()=>this.loading$.next(false)));
            case 'nail':
              return this.salonClient.searchAvailableServices('nail')
                .pipe(tap(()=>this.loading$.next(false)));
            default:
              return of([]).pipe(tap(()=>this.loading$.next(false)));
          }
      }))
      .subscribe({
        next: res=>{
          this.searchResults$.next(res);
        }
      });
  }


  searchAvailableServices() {

    let searchText = this.searchServiceForm.value;
    this.salonClient.searchAvailableServices(searchText)
      .subscribe({
        next: res=>{
          this.searchResults$.next(res);
        }
      });
  }
}
