import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {SalonClient} from "../../../service/salon-client.service";
import {BehaviorSubject} from "rxjs";
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

  availableServiceSearchResults$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  searchServiceForm: FormControl = ValidatorFactory.getGenericForm();


  constructor(private salonClient: SalonClient, public page: PageService) { }


  searchAvailableServices($event: KeyboardEvent) {

    let searchText = this.searchServiceForm.value;
    this.salonClient.searchAvailableServices(searchText)
      .subscribe({
        next: res=>{
          this.availableServiceSearchResults$.next(res);
        }
      });
  }
}
