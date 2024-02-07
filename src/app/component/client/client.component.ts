import { Component } from '@angular/core';
import { CredentialService } from 'src/app/service/credential.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

  constructor(private auth: CredentialService) { }

}
