import {Component, Input} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'salon-selector',
  standalone: true,
  imports: [ ],
  templateUrl: './bootstrap-selector.component.html',
  styleUrl: './bootstrap-selector.component.scss'
})
export class BootstrapSelectorComponent {
  @Input() selector$!: BehaviorSubject<string|undefined>
  @Input() options!: any[]
  @Input() title!: string;
  @Input() undefinedOption!: string;

  update($event: any) {
    this.selector$.next($event.target.value);
  }
}
