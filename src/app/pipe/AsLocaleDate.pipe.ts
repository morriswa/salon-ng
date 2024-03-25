import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  standalone: true,
  name: 'localeDate'
})
export class LocaleDatePipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    return date.toLocaleDateString();
  }
}
