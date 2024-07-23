import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../model/user.model';
import { BehaviorSubject, observable } from 'rxjs';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  isUserAuthenticate = new BehaviorSubject<boolean>(false);
  constructor(private router: Router, private jwtHelper: JwtHelperService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.isSignedIn()
  }

  isUserAuthenticated = (): BehaviorSubject<boolean> => {

    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {

      this.isUserAuthenticate.next(true);
      return new BehaviorSubject<boolean>(true);
    }
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    this.isUserAuthenticate.next(false);
    return new BehaviorSubject<boolean>(false);
  }

  UserInfo = (): any => {

    if (localStorage.getItem("user") != null)
      return new BehaviorSubject<User>(<User>JSON.parse(localStorage.getItem("user")));
  };

  GetUserId(): number {
    if (localStorage.getItem("user") != null)
      return (<User>JSON.parse(localStorage.getItem("user"))).company_id;
  }
  isSignedIn() {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    return false;
  }
}
