import { Component } from '@angular/core';
import {LoginService} from "../../service/login.service";
import {SalonService} from "../../service/salon.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  message?: string;

  constructor(public loginService: LoginService, private salonService: SalonService) { }

  sayHi() {
    this.salonService.login().subscribe((response:any)=>{
      this.message = response.message;
    })
  }

}
