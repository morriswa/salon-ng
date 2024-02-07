import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CredentialService {

  private _token?:string;
  private _username?:string;

  constructor() {
    let token= localStorage.getItem("org.morriswa.eecs447.credentials.token");
    if (token) this._token = token;
    let username = localStorage.getItem("org.morriswa.eecs447.credentials.username");
    if (username) this._username = username;
  }

  private readyUp() {
    if (!this.ready) throw Error("Credentials service has not been initialized! Please log in")
  }

  public createCredentials(username: string, password:string) {
    let unencodedToken = `${username}:${password}`;
    let encodedToken = btoa(unencodedToken);
    this._username = username;
    this._token = `Basic ${encodedToken}`;
    localStorage.setItem("org.morriswa.eecs447.credentials.username", this._username);
    localStorage.setItem("org.morriswa.eecs447.credentials.token", this._token);
  }

  public deleteStoredCredentials() {
    this._token = undefined;
    localStorage.removeItem("org.morriswa.eecs447.credentials.token");
    this._username = undefined;
    localStorage.removeItem("org.morriswa.eecs447.credentials.username");
  }

  public get ready() {
    return !!(this._token&&this._username);
  }

  public get username(): string {
    this.readyUp();
    return this._username!;
  }

  public get token(): string {
    this.readyUp();
    return this._token!;
  }

}
