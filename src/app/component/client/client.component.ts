import { Component } from '@angular/core';
import {LoginService} from "../../service/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

  constructor(login: LoginService, router: Router) {
    if (!login.authenticated) router.navigate(['/login']);
    if (!login.hasAuthority('CLIENT')) router.navigate(['/user'])
  }
}
