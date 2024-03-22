import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  standalone: true,
  name: 'money'
})
export class MoneyPipe implements PipeTransform {
  transform(value: string): string {

    const result = Number(value).toFixed(2);

    return `\$${result}`
  }
}
