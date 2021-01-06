import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

@Injectable()
export class LoginAuthGuard implements CanActivate {

    constructor(@Inject(SESSION_STORAGE) private sessionStorage: StorageService) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.sessionStorage.get('accessToken') ? of(false) : of(true);
    }
}
