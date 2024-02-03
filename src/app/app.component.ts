import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthenticationService } from './service/authentication.service';
import { Eecs447ClientService } from './service/eecs447-client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'eecs447-project-ng';
  usernameForm: FormControl = new FormControl();
  passwordForm:FormControl = new FormControl();
  message?:string;

  constructor(public auth: AuthenticationService, private eecs447: Eecs447ClientService) {}

  login() {
    let username = this.usernameForm.value;
    let password = this.passwordForm.value;
    this.auth.login(username, password);
  }

  sayHi() {
    this.eecs447.healthCheck().subscribe((response:any)=>{
      this.message = response.message;
    })
  }
}
