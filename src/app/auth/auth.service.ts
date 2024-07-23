
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { EnvironmentUrlService } from '../shared/services/environment-url.service';
import { User } from '../model/user.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { UserType } from '../enum/usertype.enum';


@Injectable()
export class AuthService {
  public isLoggedIn = new BehaviorSubject<boolean>(false);
  public isAdminUser = new BehaviorSubject<boolean>(false);
  public isSuperAdminUser = new BehaviorSubject<boolean>(false);
  public userName = new BehaviorSubject<string>('');
  public user: User;

  constructor(private http: HttpClient, private router: Router, private envUrl: EnvironmentUrlService) {
    if (localStorage.getItem('currentUser') != null) {
      const data = JSON.parse(localStorage.getItem('currentUser'));
      this.user = data.data;
      this.isAdminUser.next(this.user.type === UserType.Admin || this.user.type === UserType.SuperAdmin ? true : false);
      this.isLoggedIn.next(true);
      this.userName.next(this.GetUserName());
      if (this.user.type === UserType.SuperAdmin) {
        this.isSuperAdminUser.next(true);
      }
    }
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.envUrl.urlAddress}/api/User/authenticate`, { username: username, password: password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user) { // && user.token
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.isAdminUser.next(user.data.type === UserType.Admin || user.data.type === UserType.SuperAdmin ? true : false);
          this.isLoggedIn.next(true);
          this.userName.next(user.data.name);
          if (user.data.type === UserType.SuperAdmin){
            this.isSuperAdminUser.next(true);
          }
        }
        return user;
      }));
  }

  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // disabled menu
    this.isLoggedIn.next(false);
    this.isAdminUser.next(false);
    // navigate to login page
    this.router.navigate(['/login']);
  }
  GetUserName(): string {
    if (localStorage.getItem('currentUser') != null) {
      const data = JSON.parse(localStorage.getItem('currentUser'));
      this.user = data.data;
      return this.user.name;
    }
    else {
      this.logout();
    }
  }
  GetUserId(): number {
    if (localStorage.getItem('currentUser') != null) {
      const data = JSON.parse(localStorage.getItem('currentUser'));
      this.user = data.data;
      return this.user.id;
    }
    else {
      this.logout();
    }
  }
}


