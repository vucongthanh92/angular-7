import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private authSession: string;

  constructor(
    private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.authSession = sessionStorage.getItem('auth-session');
    if (this.authSession) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
