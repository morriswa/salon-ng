import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SalonStore} from "../../../service/salon-store.service";
import {PageService} from "../../../service/page.service";
import {BehaviorSubject} from "rxjs";
import {AsyncPipe, KeyValuePipe, NgForOf, NgOptimizedImage} from "@angular/common";
import {ValidatorFactory} from "../../../validator-factory";
import {MoneyPipe} from "../../../pipe/Money.pipe";
import {ProvidedServiceProfile} from "../../../interface/provided-service.interface";

@Component({
  selector: 'salon-employee-edit-service',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,

    NgForOf,
    NgOptimizedImage,

    AsyncPipe,
    KeyValuePipe,

    MoneyPipe,
  ],
  templateUrl: './employee-edit-service.component.html',
  styleUrl: './employee-edit-service.component.scss'
})
export class EmployeeEditServiceComponent {

  serviceId: number;

  currentService$: BehaviorSubject<ProvidedServiceProfile|undefined>
    = new BehaviorSubject<ProvidedServiceProfile|undefined>(undefined);

  currentServiceImages$: BehaviorSubject<any>
    = new BehaviorSubject<any>(undefined);

  cachedProfileImage$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  showDeleteServiceModal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  profilePhotoUploadForm: FormControl = ValidatorFactory.getGenericForm();

  // create service form controls
  serviceNameForm: FormControl = ValidatorFactory.getServiceNameForm();
  serviceCostForm: FormControl = ValidatorFactory.getServiceCostForm();
  serviceLengthForm: FormControl = ValidatorFactory.getServiceLengthForm();

  @ViewChild('deleteServiceModal') deleteServiceModalRef?: ElementRef;

  constructor(public page: PageService, private salonStore: SalonStore) {

    this.serviceId = Number(page.getUrlAt(2));

    salonStore.getProvidedServiceProfile(this.serviceId)
      .subscribe((res)=>this.currentService$.next(res));

    salonStore.getProvidedServiceImages(this.serviceId)
      .subscribe((res)=>this.currentServiceImages$.next(res));

    this.showDeleteServiceModal$.asObservable()
      .subscribe((res)=>{
        if (this.deleteServiceModalRef) {
          if (res) (<HTMLDialogElement>this.deleteServiceModalRef.nativeElement).showModal();
          else (<HTMLDialogElement>this.deleteServiceModalRef.nativeElement).close();
        }
      });
  }

  uploadProfileImage() {
    const image = this.cachedProfileImage$.getValue();

    if (image)
      this.salonStore.uploadProvidedServiceImage(this.serviceId, image)
        .subscribe({
          next: (res)=>{
            this.currentServiceImages$.next(res);
            this.profilePhotoUploadForm.reset();
          },
        });
    else
      console.error("No image selected!");
  }

  cacheImageToUpload($event: any) {
    let file:File = $event.target.files[0];
    this.cachedProfileImage$.next(file);
  }

  deleteImage(key: any) {
    this.salonStore.deleteProvidedServiceImage(this.serviceId, <string>key)
      .subscribe((res)=>this.currentServiceImages$.next(res));
  }

  editProvidedService() {
    let params: any = {};

    if (this.serviceNameForm.value) params['name'] = this.serviceNameForm.value;

    if (this.serviceCostForm.value) params['cost'] = this.serviceCostForm.value;

    if (this.serviceLengthForm.value) params['length'] =
      Math.ceil( this.serviceLengthForm.value / 15 );

    this.salonStore.updateProvidedServiceAndGetProfile(this.serviceId, params).subscribe({
      next: res=>{
        this.serviceNameForm.reset();
        this.serviceCostForm.reset();
        this.serviceLengthForm.reset();
        this.currentService$.next(res);
      }
    });
  }

  deleteProvidedService() {
    this.salonStore.deleteProvidedService(this.serviceId).subscribe({
      next: ()=>{
        this.page.change(['/employee','services']);
      }
    });
  }
}
