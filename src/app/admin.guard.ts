import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { tap, delay } from 'rxjs/operators';

@Injectable()
export class AdminGuard implements CanActivate {

  isAdmin: boolean = false
  constructor(private router: Router, private authService: AuthService) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //let url: string = state.url;
    //return this.checkAdmin(url);
    //if (!this.checkAdmin()) {
    //  this.router.navigate(['/shop'])
    //  return false
    //} else {
    //  return true
    //}
    return this.isAdmin;
  }

  //checkAdmin(url: string): boolean {
  //  if (!!this.authService.checkAdmin()) { return true; }

  //  // Store the attempted URL for redirecting
  //  this.authService.redirectUrl = url;

  //  // Navigate to the login page with extras
  //  this.router.navigate(['/shop']);
  //  return false;
  //}

  //checkAdmin() {
  //  this.authService.isAdmin()
  //    .subscribe(
  //    res => {
  //      this.isAdmin = res
  //      console.log(res)
  //    },
  //    err => console.log(err)
  //    )
  //  return this.isAdmin
  //}

}
