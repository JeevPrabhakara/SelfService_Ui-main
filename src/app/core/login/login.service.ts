import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/finally';
import { environment } from '../../../environments/environment';
import { StorageService, SESSION_STORAGE, isStorageAvailable } from 'angular-webstorage-service';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient, @Inject(SESSION_STORAGE) private sessionStorage: StorageService) {
  }

  showSecurityTokenInput: boolean = false;

  login(loginData): Observable<any> {
    const key = CryptoJS.enc.Utf8.parse(environment.encryptionParsePhrase);
    const iv = CryptoJS.enc.Utf8.parse(environment.encryptionParsePhrase);
    const encryptionConfig = {
      keySize: 16,
      iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
    const encryptedUsername = CryptoJS.AES.encrypt(loginData.username, key, encryptionConfig);
    const encryptedPassword = CryptoJS.AES.encrypt(loginData.password, key, encryptionConfig);
    return this.http.post(`${environment.serverUrl}/oauth/token?grant_type=password&username=${encryptedUsername}&password=${encryptedPassword}&token=${loginData.token}`, null);
  }

  setSecurityTokenInput(value: boolean) {
    this.showSecurityTokenInput = value;
  }
  getProfile() {
    const url = `${environment.serverUrl}/licenses/getAllLicenses`;
    // const url = 'http://dev2.cetas.ai:9090/cybernetix/licenses/getAllLicenses';
    return this.http.get(url);
  }

  logout() {

    if (this.sessionStorage.get('accessToken')) {
      const requestHeaders = {
        headers: new HttpHeaders({
          accessToken: this.sessionStorage.get('accessToken'),
          refreshToken: this.sessionStorage.get('refreshToken')
        })
      };

      this.http.delete(`${environment.serverUrl}/removeTokens`, requestHeaders).toPromise();
    }

    if (isStorageAvailable) {
      this.sessionStorage.remove('accessToken');
      this.sessionStorage.remove('refreshToken');
      this.sessionStorage.remove('redirectURL');
      this.sessionStorage.remove('userRoles');
      this.sessionStorage.remove('userPermissions');
      this.sessionStorage.remove('profile');
    }
  }

  refreshAuthToken(): Observable<any> {
    const refreshtoken = this.sessionStorage.get('refreshToken');
    return this.http.post(`${environment.serverUrl}/oauth/token?grant_type=refresh_token&refresh_token=${refreshtoken}`, null);
  }

  getAllUsers() {
    const url = `${environment.serverUrl}/v1/user/getAllUsers`;
    return this.http.get(url);
  }

  getSecreteKey(username: string) {
    const url = `${environment.serverUrl}/v1/user/getsecretekey/${username}/`;
    return this.http.get(url);
  }

  getLoggedInUserDetails() {
    const url = `${environment.serverUrl}/v1/user/getLoggedinUser`;
    return this.http.get(url);
  }


  /* getNotificationCount() {
    const url = `${environment.serverUrl}/v1/incident/notificationcount`;
    return this.http.get(url);
  } */

  /* getUnreadNotifications() {
    const url = `${environment.serverUrl}/v1/incident/unreadnotification`;
    return this.http.get(url);
  } */

  markNotificationAsRead(incId) {
    const url = `${environment.serverUrl}/v1/incident/notification/markasread/${incId}`;
    return this.http.get(url);
  }

}
