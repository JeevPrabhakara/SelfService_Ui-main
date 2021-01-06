import { Component, Input, OnInit, Inject } from '@angular/core';
import { TopDetailsService } from '../topDetails/topDetails.service';
import { getRiskScoreColor, User, intToString, scoreRounder } from '../../../../shared/utils/util-functions';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

@Component({
    selector: 'app-top-users',
    templateUrl: './top-users.component.html',
    styleUrls: ['./top-users.component.scss']
})
export class TopUsersComponent implements OnInit {

    @Input() user: string;
    topUserDetails: Array<User> = [];
    getRiskScoreColor = getRiskScoreColor;

    userPermissions = [];

    intToString = intToString;

    scoreRounder = scoreRounder;

    constructor(private topDetailService: TopDetailsService, private router: Router,
        @Inject(SESSION_STORAGE) private sessionStorage: StorageService) {

        this.userPermissions = JSON.parse(this.sessionStorage.get('userPermissions'));
    }

    ngOnInit() {
        this.getTopUsers();
        this.ascendingSorting();
    }

    getTopUsers() {
        this.topDetailService.getTopUsers(this.user).subscribe((res: any) => {

            this.topUserDetails = <Array<User>>res;
        });
    }

    ascendingSorting() {
        if (this.topUserDetails)
            this.topUserDetails.sort((a, b) => -(a.riskscorebygrp - b.riskscorebygrp));
    }

    redirect(entityId) {
        if (this.user === 'Orphan') {
            if (this.userPermissions && this.userPermissions.includes('Kibanaaccess_Control'))
                this.fetchOrphanUserEnrichIndexKibanaURL(entityId);
        } else {
            if (this.userPermissions && this.userPermissions.includes('Usertimeline_Control'))
                this.router.navigate(['/riskyUser', entityId])
        }

    }

    fetchOrphanUserEnrichIndexKibanaURL(orphanUserEntityId) {
        this.topDetailService.fetchOrphanUserEnrichIndexKibanaURL(orphanUserEntityId)
            .subscribe((res: any) => {
                window.open(`${environment.kibanaLink}/goto/${res.urlId}`);
            });
    }

}
