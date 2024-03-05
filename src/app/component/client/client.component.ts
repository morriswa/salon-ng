import { Component } from '@angular/core';
import {LoginService} from "../../service/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'salon-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

  constructor(public login: LoginService, public router: Router) {
    // if the user has the proper authorities, they may proceed
    // else route them appropriately
    if (!login.authenticated) router.navigate(['/login']);
    else if (!login.hasAuthority('CLIENT')) router.navigate(['/user']);
  }

  currentPageIs(page: string) {
    return this.router.routerState.snapshot.url===page;
  }
}
