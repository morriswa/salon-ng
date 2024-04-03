import { Component } from '@angular/core';
import {LoginService} from "../../service/login.service";
import {RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {PageService} from "../../service/page.service";

@Component({
  selector: 'salon-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
  ]
})
export class ClientComponent {

  constructor(public login: LoginService, public page: PageService) {
    // if the user has the proper authorities, they may proceed
    // else route them appropriately
    if (!login.authenticated) page.change(['/login']);
    else if (!login.hasAuthority('CLIENT')) page.change(['/login']);
  }
}
