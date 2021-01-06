import { Component, Inject, OnInit } from '@angular/core';
import { UserContext } from '../../services/userContext';
import { Router } from '@angular/router';
import { LoginService } from '../../login/login.service';
import { UtilService } from '../../services/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { UtilDataService } from '../../services/util.data.service';
import { ModalUtilComponent } from '../modal-util/modal.util.component';
import { DashboardService } from '../../../pages/dashboard/dashboard.service';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { notifications } from 'ionicons/icons';
import { environment } from '../../../../environments/environment';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

    options = {
        ease: 'linear',
        meteor: true,
        spinner: false,
        spinnerPosition: 'right',
        direction: 'leftToRightIncreased',
        color: '#42b4e6',
        thick: true
    };
    opened: boolean;
    notifications = [];
    themeName: string;
    private prevThemeName: string;
    riskyUsers = [];
    riskyIPAddress = [];
    riskyHosts = [];
    loggedInUserDetails = { firstName: '', lastName: '', shortLoginUserName: '' };
    activeOption: string;
    toggleOptions: string[];
    userProfile: string;
    // notificationCount: Object = 0;

    constructor(private userContext: UserContext, private router: Router, private _snackBar: MatSnackBar,
        idle: Idle, @Inject(SESSION_STORAGE) private sessionStorage: StorageService,
        private loginService: LoginService, private utilService: UtilService, public modal: NgbModal,
        private utilDataService: UtilDataService, private ngbModal: NgbModal, private dashboardService: DashboardService) {
        // debugger;
        // this.userProfile = this.loginService.userProfile;
            this.userProfile = this.sessionStorage.get('profile');

        this.themeName = this.userContext.themeName;
        this.prevThemeName = this.themeName;

        idle.setIdle(2700);      //600 - 10mins Idle(old),, 2700 - 45mins Idle
        idle.setTimeout(1);
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        idle.onTimeout.subscribe(() => {
            this.loginService.logout();
            this.sessionStorage.set('redirectURL', this.router.url);
        });

        idle.watch();
    }

    toggleMenu() {
        this.utilService.isMenuOpened = !this.utilService.isMenuOpened;
    }
    changeEntity(value) {
        // console.log(value);
        this.utilService.setProfile(value);
        (value === 'AIR') ? this.router.navigate(['/airDashboard']) :  this.router.navigate(['/amgDashboard']);

        // this.utilService.userProfile = (value == 'AIR') ? true : false;
    }

    goToWebSite() {
        // window.open('http://cybernetix.ai');
        if (this.router.url.includes('dashboard'))
            window.location.reload();
        else
            this.router.navigate(['dashboard']);
    }

    signout() {
        this.loginService.logout();
        this.router.navigate(['/login']);
    }

    showSettings(settingsModal) {
        this.modal.open(settingsModal, {
            centered: true,
            size: 'lg'
        }).result.then(() => {
        }, () => {
            this.updateTheme();
        });
    }

    closeModal() {
        this.updateTheme();
        this.modal.dismissAll();
    }

    updateTheme() {
        if (this.prevThemeName !== this.themeName) {
            this.userContext.themeName = this.themeName;
            this.prevThemeName = this.themeName;
        }
    }

    // searchEntityAvailable
    searchEntity: any = '';
    allEntitiesNames: string[] = [];

    /*  getAllUnreadNotifications() {
         this.loginService.getUnreadNotifications().subscribe((res: any) => {
             this.notifications = res;
         });
     } */

    ngOnInit() {
        if (this.userProfile === 'AIR') {
            this.toggleOptions = ['AIR'];
        } else  if (this.userProfile === 'AMG') {
            this.toggleOptions = ['AMG'];
        } else if (this.userProfile === 'AIR_AMG') {
            this.toggleOptions = ['AIR', 'AMG'];
        }
        this.activeOption = this.toggleOptions ? this.toggleOptions[0] : '';
        this.utilService.setProfile(this.activeOption);
        // this.utilService.isAIR = (this.userProfile && this.userProfile.includes('AIR')) ?  true : false;
        this.loginService.getLoggedInUserDetails().subscribe((res: any) => {
            res.shortLoginUserName = res.firstName.substring(0, 1) + res.lastName.substring(0, 1);
            this.loggedInUserDetails = res;
            this.utilDataService.setLoggedInUser(res);
        });

        /* this.loginService.getNotificationCount().subscribe((count: any) => {
            this.notificationCount = count;
        }); */
        // this.getAllUnreadNotifications();
    }

    filterRiskEntities() {

        if (this.searchEntity !== '') {
            this.utilDataService.filteredRiskyUsers = [];

            this.dashboardService.searchUserByName(this.searchEntity).subscribe((res: any) => {
                this.riskyUsers = res.users;
                this.riskyHosts = res.hosts;
                this.riskyIPAddress = res.ipAddresses;

                if (this.riskyUsers.length > 0 || this.riskyHosts.length > 0 || this.riskyIPAddress.length > 0) {
                    this.utilDataService.filteredRiskyUsers = this.riskyUsers;
                    this.utilDataService.filteredRiskyHost = this.riskyHosts;
                    this.utilDataService.filteredRiskyIPAddress = this.riskyIPAddress;
                    this.router.navigate(['/filteredRiskyUsers', this.searchEntity.toString()]);
                }

                if (res.users.length === 0 && res.hosts.length === 0 && res.ipAddresses.length === 0) {
                    this._snackBar.open('No records found', null, {
                        duration: 2000,
                        verticalPosition: 'top'
                    });


                }

            });
        } else {
            const modalRef = this.ngbModal.open(ModalUtilComponent, { size: 'sm', backdrop: 'static' }); // { size: 'sm' }
            modalRef.componentInstance.modalHeader = 'Warning';
            modalRef.componentInstance.modalMessage = 'Please Enter Risky Entity Values !';
            modalRef.componentInstance.cancelFlag = false;
        }
    }

    changeMenuOpen() {
        this.utilService.isMenuOpened = !this.utilService.isMenuOpened;
    }

    markAsRead() {
        this.notifications.forEach((notification) => {
            this.loginService.markNotificationAsRead(notification.incNotId).subscribe((res: any) => {
            });
        });
        const that = this;
        /* setTimeout(function () {
            that.loginService.getNotificationCount().subscribe((count: any) => {
                that.notificationCount = count;
            });
        }, 200); */
    }

    search = (text$: Observable<string>) =>
        text$
            .pipe(debounceTime(200))
            .pipe(distinctUntilChanged())
            .pipe(map(term => term.length < 1 ? []
                : this.allEntitiesNames.filter(entity => entity.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 4)));
}
