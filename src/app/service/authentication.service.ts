import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _username?:string;
  private _token?:string;

  constructor() {
    let token:string|null = localStorage.getItem("org.morriswa.eecs447.authenticationService.token");
    let username:string|null = localStorage.getItem("org.morriswa.eecs447.authenticationService.username");
    if (token) this._token = token;
    if (username) this._username = username;
  }

  login(username: string, password:string) {
    this._username = username;
    let unencodedToken = `${username}:${password}`;
    let encodedToken = btoa(unencodedToken);
    this._token = `Basic ${encodedToken}`;
    localStorage.setItem("org.morriswa.eecs447.authenticationService.token", this._token);
    localStorage.setItem("org.morriswa.eecs447.authenticationService.username", this._username);
  }

  get ready() {
    return (this._token&&this._username);
  }

  get username() {
    if (!this.ready) throw Error("Authentication service has not been initialized!")
    return this._username!;
  }

  get token(): string {
    if (!this.ready) throw Error("Authentication service has not been initialized!")
    return this._token!;
  }

}
