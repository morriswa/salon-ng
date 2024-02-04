import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Eecs447ClientService } from 'src/app/service/eecs447-client.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  profile$:Observable<any>;

  constructor(private auth: AuthenticationService, private eecs447Client: Eecs447ClientService, router: Router) {
    if (!auth.ready) router.navigate(['']);

    this.profile$ = this.eecs447Client.getUserProfile();
  }

}
