import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {SalonClient} from "../../../service/salon-client.service";
import {BehaviorSubject, of, switchMap, tap} from "rxjs";
import {CommonModule} from "@angular/common";
import {ValidatorFactory} from "../../../validator-factory";
import {PageService} from "../../../service/page.service";

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

  availableServiceSearchResults$: BehaviorSubject<any[]>
    = new BehaviorSubject<any[]>([]);

  currentPage$: BehaviorSubject<'hair'|'nail'|'other'>
    = new BehaviorSubject<'hair'|'nail'|'other'>('hair');

  loading$: BehaviorSubject<boolean>
    = new BehaviorSubject<boolean>(true);


  searchServiceForm: FormControl = ValidatorFactory.getGenericForm();


  constructor(private salonClient: SalonClient, public page: PageService) {
    this.salonClient.searchAvailableServices(this.currentPage$.value)
      .subscribe({
        next: res=>{
          this.availableServiceSearchResults$.next(res);
        }
      });

    this.currentPage$.asObservable()
      .pipe(
        tap(()=>this.loading$.next(true)),
        switchMap((res)=>{
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
          this.availableServiceSearchResults$.next(res);
        }
      });
  }


  searchAvailableServices() {

    let searchText = this.searchServiceForm.value;
    this.salonClient.searchAvailableServices(searchText)
      .subscribe({
        next: res=>{
          this.availableServiceSearchResults$.next(res);
        }
      });
  }
}
