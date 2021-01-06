import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { RiskyUserService } from '../dashboard/components/riskyUsers/riskyUser.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CaseModalComponent } from './components/case-modal/case-modal.component';
import { CaseManagementService } from './case-management.service';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { json } from 'd3';
import { getUniqueObjectsInArray } from '../../shared/utils/util-functions';

import { CalendarComponent } from '@syncfusion/ej2-angular-calendars';

@Component({
    selector: 'app-case-management',
    templateUrl: './case-management.component.html'
})
export class CaseManagementComponent implements OnInit {


    @ViewChild('incident') incident: Table;
    policyRangeDates: any;
    incidentRangeDates: any;
    selectedItems: any;
    selectedPolicyItems: any;
    allUsers: any = [];
    incidents = [];
    totalRecords: number = 0;
    recordsReturned: number = 0;
    private offset: number = 0;
    fetchingPolicyViolationsInProgress = true;

    shows = [
        { name: 'Last 1 Day', value: '1' },
        { name: 'Last 2 Day', value: '2' },
        { name: 'Last 7 Day', value: '7' },
        { name: 'Last 1 month', value: '30' }
    ];
    assignee: Array<any> = [];
    outcome = [
        { name: 'True Positive', value: 'True Positive' },
        { name: 'False Positive Correct Detection', value: 'False Positive Correct Detection' },
        { name: 'False Positive Wrong Detection', value: 'False Positive Wrong Detection' },
        { name: 'OPEN', value: 'Open' }
    ];

    incidentType = [
        { name: 'AutoIncident', value: 'AutoIncident' },
        { name: 'ManualIncident', value: 'ManualIncident' }
    ];

    @ViewChild('policy') policy: Table;
    @ViewChild('day') day: Table;
    myDays = [];
    policyViolations = [];
    myPolicies: any[] = [];
    selectedIndex = 0;
    criticalItem = 0;
    mediumItem = 0;
    highItem = 0;
    lowItem = 0;
    totalItem = 0;
    todayDate = new Date();
    path: any;

    constructor(private riskyUserService: RiskyUserService, private modalService: NgbModal,
        private caseManagmentService: CaseManagementService, private router: Router, private route: ActivatedRoute) {

        window.scrollTo(0, 0);
        this.offset = 0;
        this.recordsReturned = 0;
        this.myDays.push(this.todayDate);

        for (let dayIndex = 1; dayIndex < 14; dayIndex++) {
            const date = new Date();
            date.setDate(date.getDate() - dayIndex);
            this.myDays.push(date);
        }
    }

    getStageValues() {
        this.criticalItem = this.policyViolations.filter(myPolicy => myPolicy.priority === 'CRITICAL').length;
        this.mediumItem = this.policyViolations.filter(myPolicy => myPolicy.priority === 'MEDIUM').length;
        this.highItem = this.policyViolations.filter(myPolicy => myPolicy.priority === 'HIGH').length;
        this.lowItem = this.policyViolations.filter(myPolicy => myPolicy.priority === 'LOW').length;
        this.totalItem = this.criticalItem + this.mediumItem + this.lowItem + this.highItem;
    }

    ngOnInit() {
        this.route.url.subscribe(url => {
            this.path = (url[0].path);
        });

        this.router.url.includes('caseManagement') ? this.getAllIncidents(5000, 90) : this.getPolicyViolations();
        // this.getPolicyViolations();
        // this.getAllIncidents(5000, 90);  // getting before 3month from current date
    }

    onIncidentDataSelect($event) {
        debugger;
        //console.log('fo...' + this.incidentRangeDates);
    }

    selectFilterDate(selectedBeforeDate) {
        if (selectedBeforeDate)
            this.getAllIncidents(5000, selectedBeforeDate.value);
        else
            this.getAllIncidents(5000, 90);
    }

    covertDateToUTCFormat(inputDate) {
        const date = new Date(inputDate);
        const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        return _utc;
    }

    onOpen(args) {

        var startDate: Date;
        var endDate: Date;
        args.popup.element.querySelector('.e-daterangepicker .e-footer .e-apply').addEventListener('click', function () {
            //console.log('Apply button is clicked!!');
            //console.log(args.model.startDate + '...' + args.model.endDate + '...' + args.model.value + '...' + args.model.start + '...' + args.model.end);
            startDate = new Date(args.model.startDate);
            endDate = new Date(args.model.endDate);
            //console.log('start :' + startDate + '..End : ' + endDate);

        }).getAllIncidents(5000, null, startDate, endDate);
        args.popup.element.querySelector('.e-daterangepicker .e-footer .e-cancel').addEventListener('click', function () {
            //console.log('Cancel button is clicked!!');
        });
        //console.log('after function start :' + startDate + '..End : ' + endDate);
        // console.log('after function start :' + this.startDate + '..End : ' + this.endDate);
        this.getAllIncidents(5000, null, startDate, endDate);
    }

    getPolicyViolations() {
        const selectedDate = new Date(this.todayDate);
        const endDate = new Date(this.todayDate);
        selectedDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        this.caseManagmentService.getAllPolicyViolations(selectedDate.getTime(), endDate.getTime(), 0, 1000).subscribe((res: any) => {


            this.policyViolations = res;
            this.policyViolations.forEach((policy: any) => {
                policy.eventDateTimeFormatted = this.covertDateToUTCFormat(policy.eventDateTime);
                policy.generationTimeFormatted = this.covertDateToUTCFormat(policy.generationTime);
            });
            this.fetchingPolicyViolationsInProgress = false;
            this.getStageValues();
        });
    }

    getAllIncidents(incidentCount: number, previousDates?: number, startDate?: Date, endDate?: Date) {
        if (!endDate)
            var endDate = new Date();

        if (!startDate)
            var startDate = new Date();
        // const quaterDate = new Date(date.getMonth() - 3);   -> from 1970 year

        if (previousDates)
            startDate.setDate(startDate.getDate() - previousDates); // goto previous given number of month

        const formattedEndDate = endDate.getUTCFullYear() +
            '-' + (endDate.getUTCMonth() + 1) +
            '-' + (endDate.getUTCDate()) + " 23:59:59";
        /* ' ' + (endDate.getUTCHours()) +
        ':' + (endDate.getUTCMinutes()) +
        ':' + (endDate.getUTCSeconds()); */
        const formattedStartDate = startDate.getUTCFullYear() +
            '-' + (startDate.getUTCMonth() + 1) +
            '-' + (startDate.getUTCDate()) + " 00:00:00";
        /* ' ' + (startDate.getUTCHours()) +
        ':' + (startDate.getUTCMinutes()) +
        ':' + (startDate.getUTCSeconds()); */

        this.caseManagmentService.getAllIncidents(0, incidentCount, encodeURIComponent(formattedStartDate), encodeURIComponent(formattedEndDate)).subscribe((response: any) => {


            let caseOwners: Array<{ name: '', value: '' }> = [];
            response.forEach(element => {
                element.priority = element.priority ? element.priority : '-';
                element.ownerName = element.ownerName ? element.ownerName : 'Not Assigned';
                if (element.outcome == 'OPEN')
                    element.outcome = 'Open';
                else if (element.outcome == 'FALSE_POSITIVE_WRONG_DETECTION')
                    element.outcome = 'False Positive Wrong Detection';
                else if (element.outcome == 'FALSE_POSITIVE_RIGHT_DETECTION')
                    element.outcome = 'False Positive Correct Detection';
                else if (element.outcome == 'FTRUE_POSITIVE')
                    element.outcome = 'True Positive';

                caseOwners.push({ name: element.ownerName, value: element.ownerName });
            });

            this.incidents = response;
            this.assignee = getUniqueObjectsInArray(caseOwners, 'name');
        }, error => {
            //console.log('Get Incidents Error..')
        });
    }

    daySelected(date, rowIndex) {
        this.fetchingPolicyViolationsInProgress = true;
        this.selectedIndex = rowIndex;
        const selectedDate = new Date(date);
        const endDate = new Date(date);

        selectedDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        this.caseManagmentService.getAllPolicyViolations(selectedDate.getTime(), endDate.getTime(), 0, 1000).subscribe((res: any) => {


            this.fetchingPolicyViolationsInProgress = false;
            this.policyViolations = res;
            this.policyViolations.forEach((policy: any) => {
                policy.eventDateTimeFormatted = this.covertDateToUTCFormat(policy.eventDateTime);
                policy.generationTimeFormatted = this.covertDateToUTCFormat(policy.generationTime);
            });
            this.getStageValues();
        });
    }

    incidentFilter(priorityValue: any, filterType: string) {
        if (priorityValue.value)
            this.incident.filter(priorityValue.value.value, filterType, 'contains')
        else
            this.incident.filter('', filterType, 'contains')
    }

    setDateRange() {
        if (this.policyRangeDates == null) {
            let newEndDay;
            for (let dayIndex = 1; dayIndex < 14; dayIndex++) {
                const date = new Date();
                date.setDate(date.getDate() - dayIndex);
                newEndDay = date;
            }
            this.policyRangeDates = [];
            this.policyRangeDates.push(newEndDay);
            this.policyRangeDates.push(this.todayDate);
        }

        this.myDays = [];
        const endDate = new Date(this.policyRangeDates[1]);
        const startDate = new Date(this.policyRangeDates[0]);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        this.myDays.push(endDate);

        for (let dayIndex = 1; dayIndex <= diffDays; dayIndex++) {
            const date = new Date(endDate);
            date.setDate(date.getDate() - dayIndex);
            this.myDays.push(date);
        }
        const selectedDate = new Date(this.policyRangeDates[1]);
        const endDateForService = new Date(this.policyRangeDates[1]);
        selectedDate.setHours(0, 0, 0, 0);
        endDateForService.setHours(23, 59, 59, 999);

        this.caseManagmentService.getAllPolicyViolations(selectedDate.getTime(),
            endDateForService.getTime(), 0, 1000).subscribe((res: any) => {


                this.policyViolations = res;
                this.fetchingPolicyViolationsInProgress = false;
                this.getStageValues();
            });
    }

    onActionClick(name, data) {
        const modalRef = this.modalService.open(CaseModalComponent);
        modalRef.componentInstance.name = name;
        modalRef.componentInstance.data = data;
    }

    selectIncidentClick(event) {
        event ? this.incident.filter('NA', 'assignee', 'contains') : this.incident.filter('', 'assignee', 'contains');
    }

    selectPolicyClick(event) {
        event ? this.policy.filter('High', 'priority', 'contains') : this.policy.filter('', 'priority', 'contains');
    }

    fetchEnrichIndexKibanaURL(violationId) {
        event.stopPropagation();
        this.riskyUserService.rawEventCount(violationId)
            .subscribe((res: any) => {
                window.open(`${environment.kibanaLink}/goto/${res.urlId}`);
            });
    }

    redirectToEntityDetailPage(violationType, entityId) {
        switch (violationType) {
            case 'USER': this.router.navigateByUrl('/riskyUser/' + entityId);
                break;
            case 'IP': this.router.navigateByUrl('/riskyIP/' + entityId);
                break;
            case 'HOST': this.router.navigateByUrl('/riskyHost/' + entityId);
                break;
        }
    }

    redirectToSummaryPage(violationId, eventDateTime, dataAggregated) {
        this.router.navigate(['policyViolationSummary', violationId, eventDateTime, dataAggregated])
    }

}
