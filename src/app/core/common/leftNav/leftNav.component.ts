import { Component, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../services/util.service';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-menu',
    templateUrl: './leftNav.component.html'
})
export class LeftNavComponent {

    menuList = [];
    // menuListAIR = [];
    // menuListAMG = [];
    RBackList = [];
    userPermissions = [];
    userRoles = [];
    mainMenu = [];
    is_AIR: boolean;
    userProfile: string = '';
    subscription: Subscription;

    constructor(private translateService: TranslateService, private util: UtilService
        , @Inject(SESSION_STORAGE) private sessionStorage: StorageService, private router: Router,private utilService: UtilService) {

        this.userPermissions = JSON.parse(this.sessionStorage.get('userPermissions'));
        this.userRoles = JSON.parse(this.sessionStorage.get('userRoles'));
        // this.userProfile = this.sessionStorage.get('profile');
        this.subscription =  this.utilService.currentUserProfile$.subscribe(res => {

            this.isAIR(res);
            // console.log(this.menuList)
        // console.log(res)
    });
        this.RBackList = [
            // {
            //     ionIcon: '',
            //     faIcon: 'fa fa-user',
            //     img: '',
            //     title: 'Profile',
            //     navLink: '/profile',
            //     access: this.userRoles && this.userRoles.includes('ROLE_ADMIN'),
            // },
            {
                ionIcon: '',
                faIcon: '',
                // img: 'user-roles.png',
                img: 'lock.svg',
                title: 'Roles',
                navLink: '/rback/roleList',
                access: this.userRoles && this.userRoles.includes('ROLE_ADMIN')
            },
            {
                ionIcon: '',
                // faIcon: 'fa fa-users',
                faIcon:'',
                img: 'users.svg',
                title: 'Users',
                navLink: '/rback/userList',
                access: this.userRoles && this.userRoles.includes('ROLE_ADMIN')
            }
        ];


    }

    ngOnInit(): void {
        // (this.userProfile && this.userProfile.includes('AIR')) ? this.isAIR('AIR') : this.isAIR('AMG');

        // this.menuList = [
        //     {
        //         ionIcon: '',
        //         faIcon: '',
        //         img: 'dashboard_active.png',
        //         title: 'Dashboard', // this.translateService.instant('general.menu.dashboard')
        //         navLink: '/dashboard',
        //         access: this.userPermissions && this.userPermissions.includes('Dashboard_Control')
        //     },
        //     /* {
        //         ionIcon: '',
        //         faIcon: 'fa fa-lock',
        //         img: '',
        //         title: 'Violations', // this.translateService.instant('general.menu.dashboard')
        //         navLink: '/policyViolation'
        //     }, */
        //     {
        //         ionIcon: '',
        //         faIcon: 'fa fa-cogs',
        //         img: '',
        //         title: 'Data-Ops', // this.translateService.instant('general.menu.dashboard')
        //         navLink: '/caseManagement',
        //         access: this.userPermissions && this.userPermissions.includes('Insight_Control')
        //     },
        //     {
        //         ionIcon: '',
        //         faIcon: 'fa fa-pencil-square-o',
        //         img: '',
        //         title: 'Model-Ops', // this.translateService.instant('general.menu.dashboard')
        //         navLink: '/insightConfigurations',
        //         access: this.userPermissions && this.userPermissions.includes('Insightconfiguration_Control')
        //     },
        //     {
        //         ionIcon: '',
        //         faIcon: 'fa fa-lock',
        //         img: '',
        //         title: 'Entities', // this.translateService.instant('general.menu.dashboard')
        //         navLink: '/global-search/entities',
        //         access: this.userPermissions
        //     },
        //     {
        //         ionIcon: '',
        //         faIcon: 'fa fa-pencil-square-o',
        //         img: '',
        //         title: 'Insights', // this.translateService.instant('general.menu.dashboard')
        //         navLink: '/insightConfigurations',
        //         access: this.userPermissions && this.userPermissions.includes('Insightconfiguration_Control')
        //     },
        //     {
        //         ionIcon: '',
        //         faIcon: 'fa fa-globe',
        //         img: '',
        //         title: 'Identity 360', // this.translateService.instant('general.menu.dashboard')
        //         navLink: '/cyberNetixPulse',
        //         access: this.userPermissions && this.userPermissions.includes('Pulse_Control')
        //     },
        // ];
    }

    isMenuOpened() {
        return this.util.isMenuOpened;
    }

    isAIR(title: string) {
        if (title === 'AIR') {
            this.menuList = [
                {
                    ionIcon: '',
                    faIcon: '',
                    img: 'dashboard_active.png',
                    title: 'Dashboard', // this.translateService.instant('general.menu.dashboard')
                    navLink: '/airDashboard',
                    access: this.userPermissions && this.userPermissions.includes('Dashboard_Control')
                },
                {
                    ionIcon: '',
                    // faIcon: 'fa fa-cogs',
                    faIcon: '',
                    img: 'data-ops.svg',
                    title: 'Data-Ops', // this.translateService.instant('general.menu.dashboard')
                    navLink: '/dataOps',
                    access: this.userPermissions && this.userPermissions.includes('Insight_Control')
                },
                {
                    ionIcon: '',
                    faIcon: '', // fa fa-pencil-square-o
                    img: 'model-ops.svg',
                    title: 'Model-Ops', // this.translateService.instant('general.menu.dashboard')
                    navLink: '/modelOps',
                    access: this.userPermissions && this.userPermissions.includes('Insightconfiguration_Control')
                },
                {
                    ionIcon: '',
                    faIcon: '',
                    img: 'entity.svg',
                    title: 'Entities', // this.translateService.instant('general.menu.dashboard')
                    navLink: '/global-search/entities',
                    access: this.userPermissions
                },
                 {
                    ionIcon: '',
                    faIcon: '', // 'fa fa-pencil-square-o',
                    img: 'insights.svg',
                    title: 'Insights', // this.translateService.instant('general.menu.dashboard')
                    navLink: '/insights',
                    access: this.userPermissions && this.userPermissions.includes('Insightconfiguration_Control')
                },
                {
                    ionIcon: '',
                    faIcon: '', // fa fa-globe
                    img: 'identity.svg',
                    title: 'Identity 360', // this.translateService.instant('general.menu.dashboard')
                    navLink: '/identity360',
                    access: this.userPermissions && this.userPermissions.includes('Pulse_Control')
                },
                {
                    ionIcon: '',
                    faIcon: '', //fa fa-globe 
                    img: 'pulse.png',
                    title: 'Pulse', // this.translateService.instant('general.menu.dashboard')
                    navLink: '/cyberNetixPulse',
                    access: this.userPermissions && this.userPermissions.includes('Pulse_Control')
                },
            ];
        } else if (title === 'AMG') {
            this.menuList = [
                {
                    ionIcon: '',
                    faIcon: '',
                    img: 'dashboard_active.png',
                    title: 'Dashboard', // this.translateService.instant('general.menu.dashboard')
                    navLink: '/amgDashboard',
                    access: this.userPermissions && this.userPermissions.includes('Dashboard_Control')
                },
                {
                    ionIcon: '',
                    faIcon: 'fa fa-cogs',
                    img: '',
                    title: 'Drift Alerts', // this.translateService.instant('general.menu.dashboard')
                    navLink: '/driftAlerts',
                    access: this.userPermissions && this.userPermissions.includes('Insight_Control')
                },
                {
                    ionIcon: '',
                    faIcon: 'fa fa-pencil-square-o',
                    img: '',
                    title: 'Drift Predictions', // this.translateService.instant('general.menu.dashboard')
                    navLink: '/driftPredictions',
                    access: this.userPermissions && this.userPermissions.includes('Insightconfiguration_Control')
                }
            ];
        }
      }
}
