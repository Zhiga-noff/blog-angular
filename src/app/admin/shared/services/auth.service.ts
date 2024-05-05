import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FireBaseAuthResponse, User } from '../../../shared/interfaces';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AuthService {
  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {}

  get token(): string {
    const expiresDate = new Date(localStorage.getItem('fb-token-expires'));

    if (new Date() > expiresDate) {
      this.logout();
      return null;
    }

    return localStorage.getItem('fb-token');
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
        user,
      )
      .pipe(tap(this.setToken), catchError(this.handleError.bind(this)));
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private handleError(error: HttpErrorResponse) {
    const { message } = error.error.error;
    console.log(message);

    switch (message) {
      case 'INVALID_LOGIN_CREDENTIALS':
        this.error$.next('Неправильный логин или пароль');
        break;
    }

    return throwError(error);
  }

  private setToken(response: FireBaseAuthResponse | null) {
    if (response) {
      const expiresDate = new Date(
        new Date().getTime() + Number(response.expiresIn) * 1000,
      );

      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-expires', expiresDate.toString());
    } else {
      localStorage.clear();
    }
  }
}
