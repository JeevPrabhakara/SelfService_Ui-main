import { Injectable } from '@angular/core';

@Injectable()
export class SessionStorage {
    sessionStorage;
    storageKey: String = 'cyberNetizData';
    constructor() {
        this.sessionStorage = sessionStorage;
    }
    setItem(storageKey, data) {
        const key = storageKey || this.storageKey;
        this.sessionStorage.setItem(key, JSON.stringify(data));
    }
    getItem(storageKey) {
        const key = storageKey || this.storageKey;
        const sessionData = this.sessionStorage.getItem(key);
        return JSON.parse(sessionData);
    }
    removeItem(storageKey) {
        const key = storageKey || this.storageKey;
        this.sessionStorage.removeItem(key);
    }
}
