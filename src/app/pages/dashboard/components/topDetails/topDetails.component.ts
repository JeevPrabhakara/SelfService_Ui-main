import { AfterViewInit, Component, Input, OnInit, ViewChild, Inject, } from '@angular/core';
import { TopDetailsService } from './topDetails.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment.prod';
import { string } from '@amcharts/amcharts4/core';
import { intToString, getRiskScoreColor } from '../../../../shared/utils/util-functions';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';


// import {routerTransition} from '../../router.animations';

@Component({
    selector: 'top-details',
    templateUrl: './topDetails.component.html'
})
export class TopDetailsComponent implements OnInit {

    userPermissions = [];

    selectRiskyType = 'USER';
    threats: any;
    violations: any[];
    @Input() componentType: string;
    selectedRiskies: any[];

    riskyObjects = [];
    intToString = intToString;
    getRiskScoreColor = getRiskScoreColor;

    @ViewChild('selectedRiskyType') riskyTypeTable: Table;
    riskyTypeSelected = 'user';

    constructor(private topDetailsService: TopDetailsService, private router: Router,
        @Inject(SESSION_STORAGE) private sessionStorage: StorageService) {
        this.userPermissions = JSON.parse(this.sessionStorage.get('userPermissions'));
    }

    changeRiskyType(val: any) {
        this.riskyTypeSelected = val;
        this.selectedRiskies = this.riskyObjects.filter(riskyObj => riskyObj.type === this.riskyTypeSelected);
        this.selectRiskyType = String(val).toUpperCase();
        if (this.selectedRiskies) {
            this.selectedRiskies.sort((a, b) => -(a.score - b.score));
        }
    }

    ngOnInit() {
        switch (this.componentType) {
            case 'riskyEntities':
                this.getRiskyEntities();
                break;
            case 'topThreats':
                this.getThreats();
                break;
            case 'topViolations':
                this.getViolations();
                break;
        }
    }

    getRiskyEntities() {
        this.topDetailsService.getTopRiskyUsers('USER').subscribe((res: any) => {

            res.forEach(data => {
                if (data) {
                    const userObj = {
                        type: 'user',
                        entityId: data.u_employeeId,
                        score: Math.round(data.totalRiskScore),
                        img: true,
                        value: data.u_firstName == null ? data.u_employeeId : data.u_firstName
                    };
                    this.riskyObjects.push(userObj);
                }
            });
            this.selectedRiskies = this.riskyObjects.filter(riskyObj => riskyObj.type === 'user');
            this.selectedRiskies.sort((a, b) => -(a.score - b.score)); // desending order
        });

        this.topDetailsService.getTopRiskyUsers('IP').subscribe((res: any) => {

            res.forEach(data => {
                this.riskyObjects.push({
                    type: 'ip address',
                    entityId: data.ipValue,
                    score: Math.round(data.totalRiskScore),
                    img: true,
                    value: data.ipValue
                });
            });

        });

        this.topDetailsService.getTopRiskyUsers('HOST').subscribe((res: any) => {

            res.forEach(data => {
                this.riskyObjects.push({
                    type: 'host',
                    entityId: data.hostName,
                    score: Math.round(data.totalRiskScore),
                    img: true,
                    value: data.hostName
                });
            });

        });
    }

    getThreats() {
        this.topDetailsService.getTopThreats().subscribe((res: any) => {
            this.threats = res;
        });
    }

    getViolations() {
        this.topDetailsService.getTopViolations().subscribe((res: any) => {
            this.violations = res;
        });
    }

    viewRiskyEntityDetails(selectedEntity: any) {

        switch (this.selectRiskyType) {
            case 'IP ADDRESS':
                if (this.userPermissions && this.userPermissions.includes('Iptimeline_Control'))
                    this.router.navigateByUrl('/riskyIP/' + selectedEntity);
                break;
            case 'USER':
                if (this.userPermissions && this.userPermissions.includes('Usertimeline_Control'))
                    this.router.navigateByUrl('/riskyUser/' + selectedEntity);
                break;
            case 'HOST':
                if (this.userPermissions && this.userPermissions.includes('Hosttimeline_Control'))
                    this.router.navigateByUrl('/riskyHost/' + selectedEntity);
                break;
        }
    }

}
