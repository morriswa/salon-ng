import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {SalonClient} from "src/app/service/salon-client.service";
import {BehaviorSubject, Observable, of, switchMap} from "rxjs";
import {CommonModule} from "@angular/common";
import {ValidatorFactory} from "src/app/validator-factory";
import {PageService} from "src/app/service/page.service";
import {ProvidedServiceDetails} from "src/app/interface/provided-service.interface";

type TAB_SELECTOR = 'hair'|'nail'|'massage'|'other';
type TAB = { title: string, selector: TAB_SELECTOR };
const DEFAULT_TAB: TAB_SELECTOR = 'hair';

/**
 * add tabs here
 */
const TABS: TAB[] = [
  {title: 'Hair', selector: 'hair'},
  {title: 'Nails', selector: 'nail'},
  {title: 'Massages', selector: 'massage'},
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

    this.currentPage$
      .asObservable()
      .pipe(
        switchMap((res): Observable<ProvidedServiceDetails[]>=>{
          this.loading$.next(true);
          if (res!=='other') return this.salonClient.searchAvailableServices(res)
          else return of([]);
      }))
      .subscribe({
        next: res=>{
          this.searchResults$.next(res);
          this.loading$.next(false);
        }
      });

    this.searchServiceForm
      .valueChanges
      .pipe(switchMap((res): Observable<ProvidedServiceDetails[]>=>{
        if (res.length > 1 && this.currentPage$.value==='other')
          return this.salonClient.searchAvailableServices(res)
        else return of([]);
      }))
      .subscribe({
        next: res=>this.searchResults$.next(res)
      });
  }
}
