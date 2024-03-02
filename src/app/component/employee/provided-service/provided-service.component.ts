import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SalonClient} from "../../../service/salon-client.service";
import {FormControl, Validators} from "@angular/forms";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {ProvidedService} from "../../../interface/provided-service.interface";


@Component({
  selector: 'salon-provided-service',
  templateUrl: './provided-service.component.html',
  styleUrl: './provided-service.component.scss'
})
export class ProvidedServiceComponent implements AfterViewInit{

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

  displayedColumns: string[] = ['serviceId', 'name', 'defaultLength', 'defaultCost'];

  @ViewChild(MatSort) set mySorter(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  dataSource: MatTableDataSource<ProvidedService> = new MatTableDataSource<ProvidedService>([]);


  constructor(private salonClient: SalonClient) {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'serviceId': return Number(item.serviceId);
        case 'name': return item.name;
        case 'defaultLength': return Number(item.defaultLength);
        case 'defaultCost': return Number(item.defaultCost);
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

    let request = {
      name: serviceName,
      defaultCost: serviceCost,
      defaultLength: Math.ceil(serviceLength / 15)
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
