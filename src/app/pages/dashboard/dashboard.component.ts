import { Component, OnInit, Inject } from '@angular/core';
import { environment } from "../../../environments/environment";
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    userPermissions = [];

    constructor(@Inject(SESSION_STORAGE) public sessionStorage: StorageService) {
        this.userPermissions = JSON.parse(this.sessionStorage.get('userPermissions'));
    }

    ngOnInit() {
    }

    kibanaRedirection() {
        const kibanaRedirectionLink = `${environment.kibanaLink}/app/kibana#/discover?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-3y,to:now))`;
        window.open(kibanaRedirectionLink);
    }

}