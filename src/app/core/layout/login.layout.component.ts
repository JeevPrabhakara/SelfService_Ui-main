import { Component } from '@angular/core';

@Component({
    selector: 'app-login-layout',
    template: `
        <div class="container-fluid" id="main">
            <router-outlet></router-outlet>
        </div>
    `
})
export class LoginLayoutComponent { }
