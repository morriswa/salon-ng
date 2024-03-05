import {FormControl, Validators} from "@angular/forms";

export class ValidatorFactory {

  public static getFirstNameForm = () => {
    return new FormControl<string>('', [Validators.maxLength(32)]);
  }

  public static getLastNameForm = () => {
    return new FormControl<string>('', [Validators.maxLength(32)]);
  }

  public static getPhoneNumberForm = () => {
    return new FormControl('', [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^[0-9]*$")
    ]);
  }

  public static getEmailForm = () => {
    return new FormControl('', [
      Validators.maxLength(100),
      Validators.pattern("^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$")
    ]);
  }

  public static getAddressLnOneForm = () => {
    return new FormControl('', Validators.maxLength(50));
  }

  public static getAddressLnTwoForm = () => {
    return new FormControl('', Validators.maxLength(50));
  }

  public static getCityForm = () => {
    return new FormControl('', Validators.maxLength(50));
  }

  public static getStateForm = () => {
    return new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(2),
      Validators.pattern("^[A-Z]{2}$")
    ]);
  }

  public static getZipCodeForm = () => {
    return new FormControl('', [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^[0-9]{5}$")
    ]);
  }

}
