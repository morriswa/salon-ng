import { Injectable } from '@angular/core';
import {CredentialService} from "./credential.service";
import {SalonClient} from "./salon-client.service";
import {catchError, map, Observable, of, tap, throwError} from "rxjs";
import {USER_AUTHORITY} from "../type-declarations";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _account?: any;
  private _authenticated: boolean = false;
  private _processing: boolean = false;
  private _authorities: USER_AUTHORITY[] = [];

  // defn necessary getters for private attributes
  public get account(): any {
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
   * observable which will return the current authentication status
   */
  init(): Observable<boolean> {
    // if there are currently credentials cached, attempt login
    if (this.creds.ready)
      return this.attemptLogin().pipe(catchError(()=>of(false)),
      map(()=>true));
    return of(false);
  }

  private attemptLogin() {
    // set status as processing
    this._processing = true;
    // start login attempt
    return this.salonService.login()
      .pipe(
        tap((res:any)=>{ // if user was able to log in
          // set status as authenticated and not processing
          this._authenticated = true;
          this._processing = false;
          this._authorities = res.authorities;
          this._account = res;
          this._account.accountCreationDate = new Date(this._account.accountCreationDate);
        }),
        catchError(() => { // if the user was unable to log in
          // set status as unauthenticated and not processing
          this._authenticated = false
          this._processing = false;
          // and delete bad stored credentials
          this.creds.deleteStoredCredentials();
          // and throw a useful error
          return throwError(()=>of("Authentication Failed"));
        })
      );
  }

  public refreshAccountCredentials = () => this.attemptLogin();

  public hasAuthority(authority:USER_AUTHORITY): boolean {
    return this._authorities.includes(authority);
  }

  public login(username: string, password: string) { // on log in
    // set status as processing during user authentication flow
    this._processing = true;
    // register user's credentials
    this.creds.createCredentials(username, password);
    // and attempt login
    return this.attemptLogin();
  }

  public logout() { // on user logout
    // set status as unauthenticated
    this._authenticated = false;
    // and delete stored credentials
    this.creds.deleteStoredCredentials();
  }
}
