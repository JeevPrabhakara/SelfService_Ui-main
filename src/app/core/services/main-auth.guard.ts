import { Injectable, Inject } from '@angular/core';
import {  ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { UtilService } from './util.service';

@Injectable()
export class MainAuthGuard implements CanActivate {
  subscription: Subscription;

  constructor(private router: Router, private utilService: UtilService,
      @Inject(SESSION_STORAGE) private sessionStorage: StorageService) {
       }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

      if (this.sessionStorage.get('accessToken')) {
          this.subscription =  this.utilService.currentUserProfile$.subscribe(res => {
              (res === 'AIR') ? this.router.navigate(['/airDashboard']) :  this.router.navigate(['/amgDashboard']);
      });
      // console.log('MAINauth');
      this.subscription.unsubscribe();
      return of(true);
      }  else {
          this.sessionStorage.set('redirectURL', state.url);
          this.router.navigate(['/login']);  // optional url values
          return of(false);
      }
  }
}
