
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';


@Injectable()

export class AuthService {

  private _idToken: string;
  private _accessToken: string;
  private _expiresAt: number;

  auth0 = new auth0.WebAuth({
    clientID: 'MDjkXRnBL4HJiVumH41IQm2RvTkBI7jX',
    domain: 'houseapp.eu.auth0.com',
    responseType: 'token id_token',
    redirectUri: 'http://localhost:4200/callback',
    /* redirectUri: 'http://165.22.204.15:80/callback', */
    scope: 'openid'
  });


  constructor(public router: Router) {
    this._idToken = '';
    this._accessToken = '';
    this._expiresAt = 0;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  public login(): void {


    this.auth0.authorize();

  }


  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {

        console.log(authResult);
        window.location.hash = '';
        this.localLogin(authResult);
        this.router.navigate(['/dashboard']);
      } else if (err) {
        this.router.navigate(['/error']);
        console.log(err);
      }
    });

  }


  private localLogin(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public renewTokens(): void {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.localLogin(authResult);
      } else if (err) {
        alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
        this.logout();
      }
    });
  }

  public logout(): void {
    // Remove tokens and expiry time
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    //this.router.navigate(['']);

    this._accessToken = '';
    this._idToken = '';
    this._expiresAt = 0;
    this.auth0.logout({
      return_to: window.location.origin
    });



  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    /* return this._accessToken && new Date.now() < this._expiresAt; */
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }

}