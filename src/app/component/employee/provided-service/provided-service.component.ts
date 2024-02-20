import { Component } from '@angular/core';
import {Observable, switchMap} from "rxjs";
import {SalonClient} from "../../../service/salon-client.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'salon-provided-service',
  templateUrl: './provided-service.component.html',
  styleUrl: './provided-service.component.scss'
})
export class ProvidedServiceComponent {

  loading = true;
  errors: string[] = [];
  showCreateServiceMenu: boolean = false;
  serviceNameForm: FormControl = new FormControl();
  serviceCostForm: FormControl = new FormControl();
  serviceLengthForm: FormControl = new FormControl();
  services: any;

  constructor(private salonClient: SalonClient) {
   salonClient.getProvidedServices()
    .subscribe(res=>{
      this.services = res;
      this.loading = false;
    });
  }

  createNewService() {

    this.loading = true;

    let serviceName = this.serviceNameForm.value;
    let serviceCost:string = this.serviceCostForm.value;
    let serviceLength = this.serviceLengthForm.value;

    let request = {
      name: serviceName,
      defaultCost: serviceCost,
      defaultLength: serviceLength / 15
    };

    this.salonClient.createProvidedService(request)
    .pipe(switchMap(()=>this.salonClient.getProvidedServices()))
    .subscribe({
      next: (res:any) => { // if requests were successful
        this.errors = []; // reset error messages
        this.services = res; // cache profile
        this.serviceNameForm.reset();
        this.serviceLengthForm.reset();
        this.serviceCostForm.reset();
        this.showCreateServiceMenu = false;
        this.loading = false; // and mark component as available
      },
      error: (err:any) => { // if errors were encountered during profile creation
        this.errors = []; // reset error messages
        // cache all server error messages and display them to the user
        err.error.additionalInfo.map((each:any)=>this.errors.push(each.message))
        this.loading = false; // and mark component as available
      }
    });
  }
}