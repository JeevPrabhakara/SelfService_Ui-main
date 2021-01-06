import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import { SESSION_STORAGE, StorageService, isStorageAvailable } from 'angular-webstorage-service';
import { LoginService } from '../login/login.service';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {

    API_KEY: any;
    API_CIPHER: any;

    constructor(private router: Router,
        @Inject(SESSION_STORAGE) private sessionStorage: StorageService, private loginService: LoginService) {

        this.API_KEY = environment.API_KEY;
        this.API_CIPHER = environment.API_CIPHER;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

        if (request.url.includes('oauth') || request.url.includes('getsecretekey')) {
            const basicAuthToken = `Basic ${btoa('cybernetix-client:secret')}`; // base 64 encode mechanism
            request = request.clone({
                setHeaders: {
                    'Authorization': basicAuthToken
                },
                // body: 'EncryptedData Request'  -> request.body
            });
        } else {
            const accessToken = this.sessionStorage.get('accessToken');
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${accessToken}`
                },
                // body: 'EncryptedData Request'
            });
        }

        return next.handle(request)
            .do((event: any) => {
                this.loginService.setSecurityTokenInput(false);

                // if the response body has encryptedData value, then it ll get decrypted and send as response
                if (event && event.body && event.body.encryptedData) {
                    event.body = JSON.parse(CryptoJS.AES.decrypt(event.body.encryptedData, this.API_KEY, this.API_CIPHER).toString(CryptoJS.enc.Utf8));
                }
                return event;
            }, error => {

                if (error.error.error_description == '2F Authentication token required') {
                    this.loginService.setSecurityTokenInput(true);
                }

                // 401 - UnAuthorized, 403 - Access Denied
                if (error.status == 401 || error.status == 403) {
                    if (isStorageAvailable) {
                        this.sessionStorage.remove('accessToken');
                        this.sessionStorage.remove('refreshToken');
                    }
                    if (!this.sessionStorage.get('redirectURL'))
                        this.sessionStorage.set('redirectURL', this.router.url);
                    this.router.navigateByUrl('/login');
                }
                else
                    return throwError(error);
            });
    }

}
