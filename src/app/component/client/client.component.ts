import { Component } from '@angular/core';
import {LoginService} from "../../service/login.service";
import {Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'salon-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class ClientComponent {

  constructor(public login: LoginService, public router: Router) {
    // if the user has the proper authorities, they may proceed
    // else route them appropriately
    if (!login.authenticated) router.navigate(['/login']);
    else if (!login.hasAuthority('CLIENT')) router.navigate(['/login']);
  }

  currentPageIs(page: string) {
    return this.router.routerState.snapshot.url===page;
  }
}
