import {Component, Input} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'salon-selector',
  standalone: true,
  imports: [ ],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.scss'
})
export class SelectorComponent {
  @Input() selector$!: BehaviorSubject<string|undefined>
  @Input() options!: any[]
  @Input() title!: string;
  @Input() undefinedOption!: string;

  update($event: any) {
    this.selector$.next($event.target.value);
  }
}
