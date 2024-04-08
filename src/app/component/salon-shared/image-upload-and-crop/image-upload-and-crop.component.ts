import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ImageCroppedEvent, ImageCropperModule} from "ngx-image-cropper";
import {ReactiveFormsModule} from "@angular/forms";
import {BehaviorSubject, Subject} from "rxjs";
import {ValidatorFactory} from "../../../validator-factory";
import {AsyncPipe, NgIf} from "@angular/common";



@Component({
  selector: 'salon-image-upload-and-crop',
  templateUrl: './image-upload-and-crop.component.html',
  styleUrls: ['./image-upload-and-crop.component.scss'],
  imports: [
    ImageCropperModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf
  ],
  standalone: true
})
export class ImageUploadAndCropComponent {

  /**
   * one way binding for ngx image cropper
   */
  imageToCrop: any;


  @Input() resetImageForm: Subject<any> = new Subject<any>();
  @Input() cropAspectRatio: number = 1;
  @Input() forceAspectRatio: boolean = false;
  @Input() userDialog?: string;

  @Output() croppedImageEvent: EventEmitter<File|undefined> = new EventEmitter<File|undefined>();


  croppingInProgress$:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);

  finalImage$: BehaviorSubject<Blob|undefined> = new BehaviorSubject<Blob | undefined>(undefined);

  errorMessage$: BehaviorSubject<string> = new BehaviorSubject<string>("");

  fileInput = ValidatorFactory.getGenericForm();


  constructor() {
    this.resetImageForm.subscribe(()=>this.reset())
  }

  public reset() {
    this.fileInput.reset();
    this.finalImage$.next(undefined);
    this.croppingInProgress$.next(false);
    this.imageToCrop = undefined;
  }

  public newImageUploaded($event: any) {
    this.finalImage$.next(undefined);

    // extract file object from event
    let file:File = $event.target.files[0];

    switch (file.type) {
      case "image/gif":
        this.errorMessage$.next("Cannot upload gifs :(");
        break;
      case "image/heic":
        this.errorMessage$.next("Cannot upload heic images :(");
        break;
      default:
        this.imageToCrop = $event;
        break;
    }

    this.croppingInProgress$.next(true);
  }

  public imageCropped($event: ImageCroppedEvent) {
    this.finalImage$.next($event.blob!);
  }

  public confirmCropAndReturnImageObj() {

    const finalImage = this.finalImage$.value;
    if (finalImage) {
      this.croppingInProgress$.next(false);
      this.imageToCrop = undefined;
      this.croppedImageEvent.emit(finalImage as File)
    }
  }
}
