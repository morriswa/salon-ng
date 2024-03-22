import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  standalone: true,
  name: 'americanFormattedDate'
})
export class AmericanFormattedDatePipe implements PipeTransform {
  transform(value: string): string {
    return `${value.substring(5, 7)}/${value.substring(8, 10)}/${value.substring(0, 4)}`
  }
}
