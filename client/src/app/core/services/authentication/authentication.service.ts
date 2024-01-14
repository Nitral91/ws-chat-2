import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {User} from "../../interfaces/user.interface";
import {IApiResponse} from "../../interfaces/api-response.type";
import {UserTokenInterface} from "../../interfaces/user-token.interface";
import {IdentityService} from "../identity/identity.service";

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private identityService = inject(IdentityService);

  private readonly  url = 'http://localhost:3000/api/auth'
  private readonly TOKEN_KEY = 'auth-token';
  constructor(private httpClient: HttpClient) {
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isTokenExpired(token: string): boolean {
    // Decode the token to get its expiration date
    const decodedToken = this.decodeToken(token);

    if (!decodedToken || !decodedToken.exp) {
      return true;
    }

    // Check if the token is expired (in seconds)
    return Date.now() >= decodedToken.exp * 1000;
  }

  private decodeToken(token: string): UserTokenInterface | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }


  registerUser(user: Omit<User, 'id'>): Observable<boolean> {
    return this.httpClient.post<boolean>(this.url + '/register', user)
      .pipe(
        tap(res => {
          return res;
        })
      )
  }

  signUserIn(credentials: Omit<User, 'id' | 'email'>): Observable<{token: string, user: User}> {
    return this.httpClient.post<IApiResponse<{token: string, user: User}>>(this.url + '/login', credentials)
      .pipe(
        map((res: IApiResponse<{token: string, user: User}>) => {
          this.setToken(res.value.token)
          return res.value;
        })
      )
  }

  signExistingUserIn(): void {
    const userToken = this.getToken();

    if (!userToken) return;

    const userInfo = this.decodeToken(userToken);

    if (!userInfo) return;

    const user: User = {
      username: userInfo.username,
      email: userInfo.email,
      id: userInfo.id
    }

    this.identityService.setUser(user);
  }

  logoutCurrentUser(): void {
    this.removeToken();
  }
}
