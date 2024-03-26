import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class CredentialService {

  private static TOKEN_STORE = "org.morriswa.salon.credentials.token";
  private static UNAME_STORE = "org.morriswa.salon.credentials.username";

  private _token$:BehaviorSubject<string|undefined> = new BehaviorSubject<string | undefined>(undefined);
  private _username$:BehaviorSubject<string|undefined> = new BehaviorSubject<string | undefined>(undefined);

  constructor() {
    let token= localStorage.getItem(CredentialService.TOKEN_STORE);
    if (token) this._token$.next(token);
    let username = localStorage.getItem(CredentialService.UNAME_STORE);
    if (username) this._username$.next(username);
  }

  public createCredentials(username: string, password:string) {
    const rawToken = `${username}:${password}`;
    const encodedToken = btoa(rawToken);

    this._token$.next(`Basic ${encodedToken}`);
    this._username$.next(username);

    localStorage.setItem(CredentialService.TOKEN_STORE, this._token$.value!);
    localStorage.setItem(CredentialService.UNAME_STORE, this._username$.value!);
  }

  public deleteStoredCredentials() {
    this._token$.next(undefined);
    localStorage.removeItem(CredentialService.TOKEN_STORE);

    this._username$.next(undefined);
    localStorage.removeItem(CredentialService.UNAME_STORE);
  }

  public get ready(): boolean {
    return !!(this._token$.value && this._username$.value);
  }

  public get token(): string {
    const token = this._token$.value;
    if (!token) throw new Error("\"Credentials service has not been initialized! Please log in\"")
    return token;
  }

}
