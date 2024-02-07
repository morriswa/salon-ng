import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SalonClient } from 'src/app/service/salon-client.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  profile$:Observable<any>;

  constructor(private eecs447Client: SalonClient) {
    this.profile$ = this.eecs447Client.getUserProfile();
  }

}
