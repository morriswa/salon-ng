import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SalonClient} from "../../../service/salon-client.service";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {ProvidedService} from "../../../interface/provided-service.interface";
import {CommonModule} from "@angular/common";
import {MoneyPipe} from "../../../pipe/Money.pipe";
import {ValidatorFactory} from "../../../validator-factory";


@Component({
  selector: 'salon-provided-service',
  templateUrl: './employee-services.component.html',
  styleUrl: './employee-services.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatTableModule,
    MatSortModule,

    MoneyPipe,
  ]
})
export class EmployeeServicesComponent implements AfterViewInit {

  /**
   * state of view create service menu
   */
  showCreateServiceMenu$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * state of currently processing create service request
   */
  processingCreateService$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * errors encountered by create service request
   */
  createServiceErrors$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  /**
   * cached list of provided services
   */
  providedServices$: BehaviorSubject<ProvidedService[]|undefined> = new BehaviorSubject<ProvidedService[]|undefined>(undefined);

  // create service form controls
  serviceNameForm: FormControl = ValidatorFactory.getServiceNameForm();
  serviceCostForm: FormControl = ValidatorFactory.getServiceCostForm();
  serviceLengthForm: FormControl = ValidatorFactory.getServiceLengthForm();

  // required table controls
  providedServiceData: MatTableDataSource<ProvidedService> = new MatTableDataSource<ProvidedService>([]);
  providedServiceColumns: string[] = ['serviceId', 'name', 'length', 'cost'];

  // magic code to make table work
  @ViewChild(MatSort) set mySorter(sort: MatSort) {
    this.providedServiceData.sort = sort;
  }

  ngAfterViewInit(): void {
    this.providedServiceData.sort = this.mySorter;
  }

  constructor(private salonClient: SalonClient) {
    this.providedServiceData.sortingDataAccessor = (item, property): any => {
      switch (property) {
        case 'serviceId': return Number(item.serviceId);
        case 'name': return item.name;
        case 'length': return Number(item.length);
        case 'cost': return Number(item.cost);
        default: return item.serviceId;
      }
    };

    this.providedServices$.asObservable().subscribe((res)=>{
      if (res) this.providedServiceData.data = res;
    });

    // cache current services
    salonClient.getEmployeesProvidedServices()
    .subscribe((res: ProvidedService[]) =>{
      this.providedServices$.next(res);
    });
  }



  createNewService() {

    this.processingCreateService$.next(true);

    let serviceName = this.serviceNameForm.value;
    let serviceCost:string = this.serviceCostForm.value;
    let serviceLength = this.serviceLengthForm.value;

    let request: ProvidedService = {
      name: serviceName,
      cost: Number(serviceCost),
      length: Math.ceil(serviceLength / 15)
    };

    this.salonClient.createProvidedService(request)
    .subscribe({
      next: (res:any) => { // if requests were successful
        this.createServiceErrors$.next([]) // reset error messages
        this.providedServices$.next(res); // cache profile
        this.serviceNameForm.reset();
        this.serviceLengthForm.reset();
        this.serviceCostForm.reset();
        this.showCreateServiceMenu$.next(false);
        this.processingCreateService$.next(false); // and mark component as available
      },
      error: (err:any) => { // if errors were encountered during profile creation
        let errors:string[] = []
        // cache all server error messages and display them to the user
        err.error.additionalInfo.map((each:any)=>errors.push(each.message))
        this.createServiceErrors$.next(errors); // reset error messages
        this.processingCreateService$.next(false); // and mark component as available
      }
    });
  }
}
