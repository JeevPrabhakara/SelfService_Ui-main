import { EventEmitter, Injectable, Output } from '@angular/core';
import { SessionStorage } from './sessionStorage';
import { environment } from '../../../environments/environment';

@Injectable()
export class UserContext {

    theme: string;
    private themeSessionKey: string = 'selectedTheme';

    constructor(private sessionStorage: SessionStorage) {
        this.theme = this.sessionStorage.getItem(this.themeSessionKey) || environment.theme;
    }

    get themeName() {
        return this.theme;
    }

    set themeName(theme) {
        this.theme = theme;
        this.sessionStorage.setItem(this.themeSessionKey, this.theme);
        location.reload();
    }

    getTheme() {
        return `${this.theme}-theme`;
    }

}
