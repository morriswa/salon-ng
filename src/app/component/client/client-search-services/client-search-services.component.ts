import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";
import {SalonClient} from "../../../service/salon-client.service";

@Component({
  selector: 'salon-client-search-services',
  templateUrl: './client-search-services.component.html',
  styleUrl: './client-search-services.component.scss'
})
export class ClientSearchServicesComponent {

  availableServiceSearchResults: any[] = [];

  searchServiceForm: FormControl = new FormControl();



  constructor(private salonClient: SalonClient) {
  }

  searchAvailableServices($event: KeyboardEvent) {

    let searchText = this.searchServiceForm.value;
    this.salonClient.searchAvailableServices(searchText)
      .subscribe({
        next: res=>{
          this.availableServiceSearchResults = res;
        }
      });
  }

  sayHi() {

  }
}
