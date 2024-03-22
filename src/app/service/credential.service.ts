import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class CredentialService {

  private _token$:BehaviorSubject<string|undefined> = new BehaviorSubject<string | undefined>(undefined);
  private _username$:BehaviorSubject<string|undefined> = new BehaviorSubject<string | undefined>(undefined);

  constructor() {
    let token= localStorage.getItem("org.morriswa.eecs447.credentials.token");
    if (token) this._token$.next(token);
    let username = localStorage.getItem("org.morriswa.eecs447.credentials.username");
    if (username) this._username$.next(username);
  }

  public createCredentials(username: string, password:string) {
    let unencodedToken = `${username}:${password}`;
    let encodedToken = btoa(unencodedToken);
    this._username$.next(username);
    this._token$.next(`Basic ${encodedToken}`);
    localStorage.setItem("org.morriswa.eecs447.credentials.username", this._username$.getValue()!);
    localStorage.setItem("org.morriswa.eecs447.credentials.token", this._token$.getValue()!);
  }

  public deleteStoredCredentials() {
    this._token$.next(undefined);
    localStorage.removeItem("org.morriswa.eecs447.credentials.token");
    this._username$.next(undefined);
    localStorage.removeItem("org.morriswa.eecs447.credentials.username");
  }

  public get ready(): boolean {
    return !!(this._token$.getValue() && this._username$.getValue());
  }

  public get token(): string {
    const token = this._token$.getValue();
    if (!token) throw new Error("\"Credentials service has not been initialized! Please log in\"")
    return token;
  }

}
