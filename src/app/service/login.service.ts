import { Injectable } from '@angular/core';
import {CredentialService} from "./credential.service";
import {SalonStore} from "./salon-store.service";
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {USER_AUTHORITY} from "../type-declarations";
import {UserAccount} from "../interface/user-account.interface";

@Injectable()
export class LoginService {

  private _account$: BehaviorSubject<UserAccount|undefined> = new BehaviorSubject<UserAccount|undefined>(undefined);

  private _authenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // defn necessary getters for private attributes
  public get account$(): Observable<UserAccount|undefined> {
    return this._account$.asObservable();
  }

  public get authenticated(): boolean {
    return this._authenticated$.value;
  }

  public get authenticated$(): Observable<boolean> {
    return this._authenticated$.asObservable();
  }

  constructor(private creds: CredentialService, private salonStore: SalonStore) { }

  /**
   * attempts to initialize the login service
   *
   * @returns {Observable<boolean>} indicating whether the login was successful
   */
  init(): Observable<boolean> {
    // if there are currently credentials cached, attempt login
    if (this.creds.ready) return this.salonStore.login()
      .pipe(
        map((res: UserAccount)=>{ // if user was able to log in
          // set status as authenticated and not processing
          this._authenticated$.next(true);
          // this._processing.next(false);
          this._account$.next(res);
          // return true
          return true;
        }),
        catchError(() => { // if the user was unable to log in
          // reset cache
          this.logout();
          // and return false
          return of(false);
        })
      );
    // if there are no stored credentials, return false
    return of(false);
  }

  public hasAuthority(authority:USER_AUTHORITY): boolean {
    let account = this._account$.value;
    if (!account) return false;
    return account.authorities.includes(authority);
  }

  /**
   * attempts to authenticate a user with provided credentials
   *
   * @param username
   * @param password
   * @returns {Observable<boolean>} indicating whether the login was successful
   */
  public login(username: string, password: string): Observable<boolean> { // on log in
    // register user's credentials
    this.creds.createCredentials(username, password);
    // and attempt login
    return this.init();
  }

  /**
   * resets login cache and logs a user out
   */
  public logout() { // on user logout
    // reset salon client cache
    this.salonStore.resetCache();
    // set status as unauthenticated
    this._authenticated$.next(false);
    // delete cached account
    this._account$.next(undefined);
    // and delete stored credentials
    this.creds.deleteStoredCredentials();

  }
}
