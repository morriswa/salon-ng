import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {SalonStore} from "src/app/service/salon-store.service";
import {BehaviorSubject, Observable, of, switchMap} from "rxjs";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {ValidatorFactory} from "src/app/validator-factory";
import {PageService} from "src/app/service/page.service";
import {ProvidedServiceDetails} from "src/app/interface/provided-service.interface";

type TAB = { title: string, searchTerm: string };
const DEFAULT_TAB: number = 1;
const OTHER_TAB: number = 100;

/**
 * add tabs here
 */
const TABS: Map<number, TAB> = new Map([
  [DEFAULT_TAB, {title: 'Hair', searchTerm: 'hair perm'}],
  [5, {title: 'Nails', searchTerm: 'nail' }],
  [2, {title: 'Massages', searchTerm: 'massage grooming' }],
  [3, {title: 'Piercings', searchTerm: 'piercing'}],
  [OTHER_TAB, {title: 'Other', searchTerm: 'other'}]
]);


@Component({
  selector: 'salon-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NgOptimizedImage,
  ]
})
export class BookingComponent {

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
  currentPage$: BehaviorSubject<number>;

  /**
   * emits whether the component is in a loading state
   */
  loading$: BehaviorSubject<boolean>
    = new BehaviorSubject<boolean>(true);



  searchServiceForm: FormControl = ValidatorFactory.getGenericForm();


  constructor(private salonStore: SalonStore, public page: PageService) {

    const navigationTab: number = Number(page.getUrlSegmentElse(2, DEFAULT_TAB.toString()));

    this.currentPage$ = new BehaviorSubject<number>(navigationTab);

    page.change(['/client', 'services', navigationTab]);

    this.currentPage$
      .asObservable()
      .pipe(
        switchMap((res): Observable<ProvidedServiceDetails[]>=>{
          this.page.change(['/client', 'services', res])
          this.loading$.next(true);
          if (res!==OTHER_TAB) return this.salonStore.searchAvailableServices(this.tabs.get(res)?.searchTerm!);
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
        if (res.length > 1 && this.currentPage$.value===OTHER_TAB)
          return this.salonStore.searchAvailableServices(res)
        else return of([]);
      }))
      .subscribe({
        next: res=>this.searchResults$.next(res)
      });
  }

  protected readonly OTHER_TAB = OTHER_TAB;
}
