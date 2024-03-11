import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private API_URL = 'http://localhost:3010/auth/session';

  constructor(private http: HttpClient) {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.setItem('auth-user', JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem('auth-user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  public isLoggedIn(): boolean {
    return !!this.getUser();
  }

  public getUserRole(): Observable<string> {
    return this.http.post<any>(this.API_URL, {}).pipe(
      map(data => {
        if (data && data.role) {
          this.saveUser(data);
          return data.role;
        } else {
          throw new Error('Failed to get user role');
        }
      })
    );
  }

  public getUserInfo(): Observable<any> {
    return this.http.post<any>(this.API_URL, {}).pipe(
      map(data => {
        if (data) {
          this.saveUser(data);
          return data;
        } else {
          throw new Error('Failed to get user info');
        }
      })
    );
  }
}
