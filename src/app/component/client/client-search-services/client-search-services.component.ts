import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {SalonStore} from "src/app/service/salon-store.service";
import {BehaviorSubject, Observable, of, switchMap} from "rxjs";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {ValidatorFactory} from "src/app/validator-factory";
import {PageService} from "src/app/service/page.service";
import {ProvidedServiceDetails} from "src/app/interface/provided-service.interface";

type TAB_SELECTOR = 'hair perm'|'nail'|'massage grooming'|'piercing'|'other';
type TAB = { title: string, selector: TAB_SELECTOR };
const DEFAULT_TAB: TAB_SELECTOR = 'hair perm';

/**
 * add tabs here
 */
const TABS: TAB[] = [
  {title: 'Hair', selector: 'hair perm'},
  //{title: 'Nails', selector: 'nail'},
  {title: 'Massages', selector: 'massage grooming'},
  {title: 'Piercings', selector: 'piercing'},
  {title: 'Other', selector: 'other'}
]

@Component({
  selector: 'salon-client-search-services',
  templateUrl: './client-search-services.component.html',
  styleUrl: './client-search-services.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NgOptimizedImage,
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
  currentPage$: BehaviorSubject<string>;

  /**
   * emits whether the component is in a loading state
   */
  loading$: BehaviorSubject<boolean>
    = new BehaviorSubject<boolean>(true);



  searchServiceForm: FormControl = ValidatorFactory.getGenericForm();


  constructor(private salonStore: SalonStore, public page: PageService) {

    const navigationTab: string = page.getUrlSegmentElse(2, DEFAULT_TAB);

    this.currentPage$ = new BehaviorSubject<string>(navigationTab);

    page.change(['/client', 'services', navigationTab]);

    this.currentPage$
      .asObservable()
      .pipe(
        switchMap((res): Observable<ProvidedServiceDetails[]>=>{
          this.page.change(['/client', 'services', res])
          this.loading$.next(true);
          if (res!=='other') return this.salonStore.searchAvailableServices(res)
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
          return this.salonStore.searchAvailableServices(res)
        else return of([]);
      }))
      .subscribe({
        next: res=>this.searchResults$.next(res)
      });
  }
}
