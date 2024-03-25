import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  standalone: true,
  name: 'localeTime'
})
export class LocaleTimePipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    return date.toLocaleTimeString();
  }
}
