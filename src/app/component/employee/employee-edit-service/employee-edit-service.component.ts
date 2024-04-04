import { Component } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SalonClient} from "../../../service/salon-client.service";
import {PageService} from "../../../service/page.service";
import {BehaviorSubject} from "rxjs";
import {AsyncPipe, NgForOf, NgOptimizedImage} from "@angular/common";
import {ValidatorFactory} from "../../../validator-factory";
import {MoneyPipe} from "../../../pipe/Money.pipe";
import {ProvidedServiceProfile} from "../../../interface/provided-service.interface";

@Component({
  selector: 'salon-employee-edit-service',
  standalone: true,
  imports: [
    FormsModule,
    AsyncPipe,
    ReactiveFormsModule,
    MoneyPipe,
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './employee-edit-service.component.html',
  styleUrl: './employee-edit-service.component.scss'
})
export class EmployeeEditServiceComponent {
  serviceId: number;
  currentService$: BehaviorSubject<ProvidedServiceProfile|undefined> = new BehaviorSubject<ProvidedServiceProfile|undefined>(undefined);
  profilePhotoUploadForm: FormControl = ValidatorFactory.getGenericForm();
  cachedProfileImage$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  constructor(public page: PageService, private salonClient: SalonClient) {

    this.serviceId = Number(page.getUrlAt(2));


    salonClient.getProvidedServiceDetailsForClient(this.serviceId)
      .subscribe((res)=>this.currentService$.next(res))
  }
  uploadProfileImage() {
    const image = this.cachedProfileImage$.getValue();

    if (image)
      this.salonClient.uploadProvidedServiceImage(this.serviceId, image)
        .subscribe({
          next: (res:ProvidedServiceProfile)=>{
            this.currentService$.next(res);
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

}
