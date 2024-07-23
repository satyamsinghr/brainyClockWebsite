import { Injectable } from "@angular/core";
import { AuthGuard } from "./auth.guard";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class IsSignedInGuard implements CanActivate {
  // here you can inject your auth service to check that user is signed in or not
  constructor(private authService: AuthGuard, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isSignedIn()) {
      this.router.navigate(["/"]); // or home
      return false;
    }
    return true;
  }
}
