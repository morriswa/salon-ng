import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SalonClient} from "../../../service/salon-client.service";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {ProvidedService} from "../../../interface/provided-service.interface";
import {CommonModule} from "@angular/common";
import {MoneyPipe} from "../../../pipe/Money.pipe";


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
  serviceNameForm: FormControl = new FormControl('',[
    Validators.maxLength(128)
  ]);
  serviceCostForm: FormControl = new FormControl('',[
    Validators.pattern('^[0-9]{1,3}(\.[0-9]{1,2})?$'),
    Validators.min(0.01), Validators.max(999.99)
  ]);
  serviceLengthForm: FormControl = new FormControl('',[
    Validators.pattern('^[0-9]{1,3}$'),
    Validators.min(1), Validators.max(480)
  ]);

  displayedColumns: string[] = ['serviceId', 'name', 'length', 'cost'];

  @ViewChild(MatSort) set mySorter(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  dataSource: MatTableDataSource<ProvidedService> = new MatTableDataSource<ProvidedService>([]);


  constructor(private salonClient: SalonClient) {
    this.dataSource.sortingDataAccessor = (item, property): any => {
      switch (property) {
        case 'serviceId': return Number(item.serviceId);
        case 'name': return item.name;
        case 'length': return Number(item.length);
        case 'cost': return Number(item.cost);
        default: return item.serviceId;
      }
    };

    this.providedServices$.subscribe((res)=>{
      if (res) this.dataSource.data = res;
    });

    // cache current services
    salonClient.getEmployeesProvidedServices()
    .subscribe((res: ProvidedService[]) =>{
      this.providedServices$.next(res);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.mySorter;
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
