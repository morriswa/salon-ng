import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CredentialService } from 'src/app/service/credential.service';
import { SalonClient } from 'src/app/service/salon-client.service';
import {LoginService} from "../../service/login.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  profile$:Observable<any>;

  constructor(private login: LoginService, private eecs447Client: SalonClient, router: Router) {

    console.log(`user is authenticated with username ${login.username}`)


    this.profile$ = this.eecs447Client.getUserProfile();
  }

}
