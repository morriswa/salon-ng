import {FormControl, Validators} from "@angular/forms";

export class ValidatorFactory {

  public static getGenericForm = () => {
    return new FormControl();
  }

  public static getUsernameForm = () => {
    return new FormControl({value: '', disabled: true});
  }

  public static getPasswordForm = () => {
    return new FormControl({value: '', disabled: true});
  }

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

  public static getZipCodeForm = () => {
    return new FormControl('', [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^[0-9]{5}$")
    ]);
  }

  public static getServiceNameForm = () =>
    new FormControl('',[
      Validators.maxLength(128)
    ]);

  public static getServiceCostForm = () =>
    new FormControl('',[
      Validators.pattern('^[0-9]{1,3}(\.[0-9]{1,2})?$'),
      Validators.min(0.01), Validators.max(999.99)
    ]);

  public static getServiceLengthForm = () =>
    new FormControl('',[
      Validators.pattern('^[0-9]{1,3}$'),
      Validators.min(1), Validators.max(480)
    ]);

}
