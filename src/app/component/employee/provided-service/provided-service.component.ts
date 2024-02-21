import { Component } from '@angular/core';
import {BehaviorSubject, switchMap} from "rxjs";
import {SalonClient} from "../../../service/salon-client.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'salon-provided-service',
  templateUrl: './provided-service.component.html',
  styleUrl: './provided-service.component.scss'
})
export class ProvidedServiceComponent {

  processingCreateService$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  showCreateServiceMenu$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  providedService$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);


  errors: string[] = [];
  serviceNameForm: FormControl = new FormControl();
  serviceCostForm: FormControl = new FormControl();
  serviceLengthForm: FormControl = new FormControl();

  constructor(private salonClient: SalonClient) {
   salonClient.getProvidedServices()
    .subscribe(res=>{
      this.providedService$.next(res);
      this.processingCreateService$.next(false);
    });
  }

  createNewService() {

    this.processingCreateService$.next(true);

    let serviceName = this.serviceNameForm.value;
    let serviceCost:string = this.serviceCostForm.value;
    let serviceLength = this.serviceLengthForm.value;

    let request = {
      name: serviceName,
      defaultCost: serviceCost,
      defaultLength: Math.ceil(serviceLength / 15)
    };

    this.salonClient.createProvidedService(request)
    .pipe(switchMap(()=>this.salonClient.getProvidedServices()))
    .subscribe({
      next: (res:any) => { // if requests were successful
        this.errors = []; // reset error messages
        this.providedService$.next(res); // cache profile
        this.serviceNameForm.reset();
        this.serviceLengthForm.reset();
        this.serviceCostForm.reset();
        this.showCreateServiceMenu$.next(false);
        this.processingCreateService$.next(false); // and mark component as available
      },
      error: (err:any) => { // if errors were encountered during profile creation
        this.errors = []; // reset error messages
        // cache all server error messages and display them to the user
        err.error.additionalInfo.map((each:any)=>this.errors.push(each.message))
        this.processingCreateService$.next(false); // and mark component as available
      }
    });
  }
}
