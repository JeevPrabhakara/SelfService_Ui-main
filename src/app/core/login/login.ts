import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { UserContext } from '../services/userContext';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { SecreteKeyPupupComponent } from '../login/secrete-key-popup/secrete-key-popup.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { UtilService } from '../services/util.service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.html'
})
export class LoginComponent {

    form: FormGroup;
    username: AbstractControl;
    password: AbstractControl;
    token: AbstractControl;
    themeName: string;
    isError: boolean = false;
    showSecurityTokenInput: boolean = false;
    secreteKey: string;
    secreteKeyQRUrl: string;
    API_KEY: any;
    API_CIPHER: any;

    inValidPermissionUserError = false;

    constructor(private fb: FormBuilder, private loginService: LoginService,
         private userContext: UserContext, private utilService: UtilService,
        private router: Router, @Inject(SESSION_STORAGE) private sessionStorage: StorageService, public dialog: MatDialog) {
            this.API_KEY = environment.API_KEY;
        this.API_CIPHER = environment.API_CIPHER;

        this.sessionStorage.remove('accessToken');
        this.sessionStorage.remove('refreshToken');
        this.sessionStorage.remove('userRoles');
        this.sessionStorage.remove('userPermissions');
        this.sessionStorage.remove('profile');

        this.themeName = this.userContext.themeName;
        this.form = this.fb.group({
            'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'token': ['', Validators.compose([Validators.minLength(4)])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });
        this.username = this.form.controls['username'];
        this.password = this.form.controls['password'];
        this.token = this.form.controls['token'];
    }

    openSecreteKeyPupup(): void {
        const dialogRef = this.dialog.open(SecreteKeyPupupComponent, {
            width: '400px',
            data: { secreteKey: this.secreteKey, secreteKeyQRUrl: this.secreteKeyQRUrl }
        });
    }

    loginSubmit(): void {
        this.inValidPermissionUserError = false;

        if (this.form.valid) {
            this.loginService.login(this.form.value).subscribe(res => {
                this.sessionStorage.set('accessToken', res.access_token);
                this.sessionStorage.set('refreshToken', res.refresh_token);
                this.dialog.closeAll();
                this.showSecurityTokenInput = this.loginService.showSecurityTokenInput;
                this.loginService.getProfile().subscribe(res => {
                    res[0].licenseName = CryptoJS.AES.decrypt(res[0].licenseName,
                         this.API_KEY, this.API_CIPHER).toString(CryptoJS.enc.Utf8);
                    res[0].licenseDesc = CryptoJS.AES.decrypt(res[0].licenseDesc,
                         this.API_KEY, this.API_CIPHER).toString(CryptoJS.enc.Utf8);
                    this.sessionStorage.set('profile', res[0].licenseName );
                    this.utilService.setProfile(res[0].licenseName ? (res[0].licenseName).substring(0,3) : '');
                  }
                  );

                this.loginService.getLoggedInUserDetails().subscribe((res: any) => {
                    this.sessionStorage.set('userRoles', JSON.stringify(res.distinctRoles));
                    this.sessionStorage.set('userPermissions', JSON.stringify(res.distinctPermissions));
                    const redirectURL = this.sessionStorage.get('redirectURL');
                    const redirectFlag = res.distinctPermissions.includes('Dashboard_Control') && res.distinctPermissions.includes('Insight_Control') && res.distinctPermissions.includes('Insightconfiguration_Control')
                        && res.distinctPermissions.includes('Pulse_Control') && res.distinctPermissions.includes('Entity_Control');
                    if (redirectURL && redirectURL != '' && redirectFlag) {
                        this.router.navigateByUrl(redirectURL);
                        this.sessionStorage.remove('redirectURL');
                    } else if (res.distinctPermissions.includes('Dashboard_Control')) {
                        this.router.navigateByUrl('/dashboard');
                        return;
                    } else if (res.distinctPermissions.includes('Insight_Control')) {
                        this.router.navigateByUrl('/caseManagement');
                        return;
                    } else if (res.distinctPermissions.includes('Insightconfiguration_Control')) {
                        this.router.navigateByUrl('/insightConfigurations');
                        return;
                    } else if (res.distinctPermissions.includes('Entity_Control')) {
                        this.router.navigateByUrl('/entity');
                        return;
                    }  else if (res.distinctPermissions.includes('Pulse_Control')) {
                        this.router.navigateByUrl('/cyberNetixPulse');
                        return;
                    } else if (res.distinctRoles.includes('ROLE_ADMIN') && res.distinctPermissions.includes('View_Profile')) {
                        this.router.navigateByUrl('/rback');
                        return;
                    } else if (res.distinctRoles.includes('ROLE_ADMIN') && res.distinctPermissions.includes('View_Profile')) {
                        this.router.navigateByUrl('/rback/userList');
                        return;
                    } else {
                        this.inValidPermissionUserError = true;
                    }
                });

            }, error => {
                /* this.showSecurityTokenInput = this.loginService.showSecurityTokenInput;
                if (this.showSecurityTokenInput) {
                    this.loginService.getSecreteKey(this.username.value).subscribe((res: any) => {
                        this.secreteKey = res['SecreteKey'];
                        this.secreteKeyQRUrl = res['SecreteKeyQRURL'];
                    });

                    if (this.token.value)
                        this.openSecreteKeyPupup();
                    this.token.setValue('');

                    return;
                } */
                this.isError = true;
            });
        }
    }

}
