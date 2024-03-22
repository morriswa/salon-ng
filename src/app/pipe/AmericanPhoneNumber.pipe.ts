import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  standalone: true,
  name: 'americanPhoneNumber'
})
export class AmericanPhoneNumberPipe implements PipeTransform {
  transform(value: string): string {
    const areaCode = value.substring(0, 3)
    const firstThree = value.substring(3, 6)
    const lastFour = value.substring(6, 10)

    return `+1 (${areaCode}) ${firstThree}-${lastFour}`;
  }
}
