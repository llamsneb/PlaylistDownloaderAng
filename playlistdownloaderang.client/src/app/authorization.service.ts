import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  clientId: string = '22371a408fff416ead0fdfe8019d0a1a'; // your clientId
  redirectUrl: string = 'https://localhost:4200';        // your redirect URL - must be localhost URL and/or HTTPS

  authorizationEndpoint: string = "https://accounts.spotify.com/authorize";
  tokenEndpoint: string = "https://accounts.spotify.com/api/token";
  scope: string = 'user-read-private user-read-email';

  // Data structure that manages the current active token, caching it in localStorage
  currentToken: any = {
    get access_token() { return localStorage.getItem('access_token') || null; },
    get refresh_token() { return localStorage.getItem('refresh_token') || null; },
    get expires_in() { return localStorage.getItem('expires_in') || null },
    get expires() { return localStorage.getItem('expires') || null },

    save: function (response: any) {
      const { access_token, refresh_token, expires_in } = response;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('expires_in', expires_in);

      const now = new Date();
      const expiry = new Date(now.getTime() + (expires_in * 1000));
      localStorage.setItem('expires', expiry.toString());
    }
  };

  constructor() { }

  async redirectToSpotifyAuthorize() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(64));
    const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");

    const code_verifier = randomString;
    const data = new TextEncoder().encode(code_verifier);
    const hashed = await crypto.subtle.digest('SHA-256', data);

    const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    window.localStorage.setItem('code_verifier', code_verifier);

    const authUrl = new URL(this.authorizationEndpoint)
    const params = {
      response_type: 'code',
      client_id: this.clientId,
      scope: this.scope,
      code_challenge_method: 'S256',
      code_challenge: code_challenge_base64,
      redirect_uri: this.redirectUrl,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
  }

  hasToken() {
    return this.currentToken.access_token != null && this.currentToken.access_token != 'undefined'
      ? true
      : false;    
  }

  isValidToken() {
    const now = new Date();
    const expireTime = new Date(this.currentToken.expires);
    return now < expireTime ? true : false;
    
  }

  // Soptify API Calls
  async getToken(code: string) {
    const code_verifier = localStorage.getItem('code_verifier') ?? '';

    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUrl,
        code_verifier: code_verifier,
      }),
    });

    return await response.json();
  }

  async refreshToken() {
    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        grant_type: 'refresh_token',
        refresh_token: this.currentToken.refresh_token
      }),
    });

    const token = await response.json();
    this.currentToken.save(token);
  }

}
