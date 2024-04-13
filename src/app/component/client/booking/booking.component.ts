import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {SalonStore} from "src/app/service/salon-store.service";
import {BehaviorSubject, Observable, of, switchMap} from "rxjs";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {ValidatorFactory} from "src/app/validator-factory";
import {PageService} from "src/app/service/page.service";
import {ProvidedServiceDetails} from "src/app/interface/provided-service.interface";

type TAB = { title: string, searchTerm: string, order: number, href: string };
const DEFAULT_TAB: string = 'hair';
const OTHER_TAB: string = 'other';

/**
 * add tabs here
 */
const TABS: TAB[] = [
  { href: 'hair', title: 'Hair', searchTerm: 'hair perm', order: 1 },
  { href: 'nails', title: 'Nails', searchTerm: 'nail', order: 2 },
  { href: 'massages', title: 'Massages', searchTerm: 'massage grooming', order: 3 },
  { href: 'piercings', title: 'Piercings', searchTerm: 'piercing', order: 4 },
  { href: 'other', title: 'Other', searchTerm: 'other', order: 5 }
];

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

  tabMap: Map<string, any>;

  /**
   * translate const to class attr
   */
  tabs: TAB[] = TABS;

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

    {
      let buildTabMap = new Map<string, TAB>();
      for (let tab of this.tabs) buildTabMap.set(tab.href, tab);
      this.tabMap = buildTabMap;
    }

    const navigationTab: string = page.getUrlSegmentElse(2, DEFAULT_TAB);

    this.currentPage$ = new BehaviorSubject<string>(navigationTab);

    page.change(['/client', 'booking', navigationTab]);

    this.currentPage$
      .asObservable()
      .pipe(
        switchMap((res): Observable<ProvidedServiceDetails[]>=>{
          this.page.change(['/client', 'booking', res])
          this.loading$.next(true);
          if (res!==OTHER_TAB) return this.salonStore.searchAvailableServices(this.tabMap.get(res)?.searchTerm!);
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
