import { Injectable } from '@angular/core';
import {CredentialService} from "./credential.service";
import {SalonClient} from "./salon-client.service";
import {catchError, map, Observable, of} from "rxjs";
import {USER_AUTHORITY} from "../type-declarations";
import {UserAccount} from "../interface/user-account.interface";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _account?: UserAccount;
  private _authenticated: boolean = false;
  private _processing: boolean = false;

  // defn necessary getters for private attributes
  public get account(): UserAccount {
    if (!this._account) throw new Error("Login service has not been initialized!");
    return this._account;
  }

  public get processing(): boolean {
    return this._processing;
  }

  public get authenticated(): boolean {
    return this._authenticated
  }

  constructor(private creds: CredentialService, private salonService: SalonClient) { }

  /**
   * attempts to initialize the login service
   *
   * @returns {Observable<boolean>} indicating whether the login was successful
   */
  init(): Observable<boolean> {
    // if there are currently credentials cached, attempt login
    if (this.creds.ready) {
      // set status as processing
      this._processing = true;
      // start login attempt
      return this.salonService.login()
        .pipe(
          map((res: UserAccount)=>{ // if user was able to log in
            // set status as authenticated and not processing
            this._authenticated = true;
            this._processing = false;
            this._account = res;
            // return true
            return true;
          }),
          catchError(() => {// if the user was unable to log in
            // reset cache
            this.logout();
            // and return false
            return of(false);
          })
        );
    }
    // if there are no stored credentials, return false
    return of(false);
  }

  public hasAuthority(authority:USER_AUTHORITY): boolean {
    return this.account.authorities.includes(authority);
  }

  /**
   * attempts to authenticate a user with provided credentials
   *
   * @param username
   * @param password
   * @returns {Observable<boolean>} indicating whether the login was successful
   */
  public login(username: string, password: string): Observable<boolean> { // on log in
    // set status as processing during user authentication flow
    this._processing = true;
    // register user's credentials
    this.creds.createCredentials(username, password);
    // and attempt login
    return this.init();
  }

  /**
   * resets login cache and logs a user out
   */
  public logout() { // on user logout
    // set status as unauthenticated
    this._authenticated = false;
    // delete cached account
    this._account = undefined;
    // and delete stored credentials
    this.creds.deleteStoredCredentials();
    // reset processing flag
    this._processing = false;
  }
}
