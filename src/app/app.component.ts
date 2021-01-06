import { Component, HostBinding, HostListener, OnInit, Inject } from '@angular/core';
import { UserContext } from './core/services/userContext';

@Component({
    selector: 'body',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    @HostBinding('class') public theme: string;
    constructor(private userContext: UserContext) {
        this.theme = this.userContext.getTheme();
    }

}
