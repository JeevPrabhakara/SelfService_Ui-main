import { Component, NgZone, Inject } from '@angular/core';
import { RiskyUserService } from './riskyUser.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RiskyUserInfoModalComponent } from './risky-user-info-modal/risky-user-info-modal.component';
import { CaseManagementService } from './../../../case-management/case-management.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { RiskScoreModalComponent } from './risk-score-modal/risk-score-modal.component';
import { TopDetailsService } from '../topDetails/topDetails.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../../environments/environment';
import { UtilDataService } from '../../../../core/services/util.data.service';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { barChartData, ChartColors} from './data';
import * as Highcharts from 'highcharts';
// import highcharts3D from 'highcharts/highcharts-3d.src';
// highcharts3D(Highcharts);

@Component({
    selector: 'risky-users',
    templateUrl: './riskyUsers.component.html'
})
export class RiskyUsersComponent {


    selectedUser: string = null;
    allUsers: any = [];
    selectedDateRange: string;
    dateRanges = ['1 Week', '2 Weeks', '1 Month', '3 Months', '6 Months', '1 Year'];
    totalRecords: number = 0;
    recordsReturned: number = 0;
    selectedUserDetails: any = {};
    selectedView = 'timeline';
    private offset: number = 0;
    policyViolations = [];
    selectedUserInfo: any[];
    userData: any;
    riskyObjects = [];
    activities = [];
    hardCodeItemData = [];
    flightUserHardCodeItemData = [];
    policyViolationData = [];
    eventCounts = {
        events: 0,
        resources: 0,
        locations: 0,
        incidents: 0,
        violations: 0
    };

    actionButtonName = '';
    userPermissions = [];

    constructor(private amChartService: AmChartsService, private riskyUserService: RiskyUserService, private routeParam: ActivatedRoute, private modalService: NgbModal,
        private zone: NgZone, private router: Router, private _snackBar: MatSnackBar, private topDetailsService: TopDetailsService,
        private caseManagementService: CaseManagementService, private utilService: UtilDataService,
        @Inject(SESSION_STORAGE) private sessionStorage: StorageService) {

        this.userPermissions = JSON.parse(this.sessionStorage.get('userPermissions'));

        this.offset = 0;
        this.recordsReturned = 0;
        this.selectedDateRange = '1 Week';
        window.scrollTo(0, 0);
    }

    ngOnInit() {
        this.routeParam.paramMap.subscribe((params: any) => {
            this.selectedUser = params.get('selectedUser');
            this.riskyUserService.getRiskyEntityDetails(this.selectedUser, 'USER').subscribe((res: any) => {

                res.riskScore = Math.round(res.riskScore);
                this.userData = res;

                this.zone.runOutsideAngular(() => {
                    // Initialize Guage meter chart
                    this.initializeGuageMeterChart();
                });
            });

            this.riskyUserService.getRiskyUserCountDetails(this.selectedUser).subscribe((res: any) => {

                if (res) {
                    this.eventCounts = res;
                }
                this.activities = [];
                this.activities.push({ image: 'falg@1x.png', title: 'Events', value: this.eventCounts.events });
                this.activities.push({ image: 'resources@1x.png', title: 'Resources', value: this.eventCounts.resources });
                this.activities.push({ image: 'Shape@1x.png', title: 'Locations', value: this.eventCounts.locations });
                this.activities.push({ image: 'violations@1x.png', title: 'Violations', value: this.eventCounts.violations });
                this.activities.push({ image: 'incident@1x.png', title: 'Incidents', value: this.eventCounts.incidents });
            });

            const date = new Date();
            this.riskyUserService.getPolicyViolationForGivenPeriod(this.selectedUser, 0, date.getTime(), 0).subscribe((res: any) => {

                if (res && res.length > 0) {
                    res.forEach((policyViolation) => {
                        if (policyViolation.shouldShowIncidentCreationOption) {
                            if (policyViolation.autoIncidentCreated) {
                                policyViolation.actionButtonName = "AI Incident Created";
                            } else if (policyViolation.incidentCreated) {
                                policyViolation.actionButtonName = "Manual Incident Created";
                            } else {
                                policyViolation.actionButtonName = "Create an Incident";
                            }
                        }
                        if (policyViolation.timeLines && policyViolation.timeLines.length > 0) {
                            policyViolation.timeLines.forEach((timeLine) => {
                                timeLine['accord'] = false;
                                timeLine['subAccord'] = false;
                                if (timeLine.violationEventTime) {
                                    timeLine.violationEventTime = timeLine.violationEventTime + 'Z';
                                    timeLine.violationTime = this.covertDateToUTCFormat(timeLine.violationEventTime)
                                }
                            });
                        }
                    });
                    this.policyViolations = res.reverse();
                } else if (this.userData.riskScore != 0)
                    this._snackBar.open('Data processing is happening, Please retry after some time', null, {
                        duration: 4000,
                    });
                else if (this.userData.riskScore == 0)
                    this._snackBar.open('User does not have any Violations', null, {
                        duration: 3000,
                    });
            });
        });
        const startDate = 0;
        const endDate = new Date();
        this.riskyUserService.getPolicyViolationsForEntity(this.selectedUser, startDate, endDate.getTime()).subscribe((res: any) => {
            this.policyViolationData = res;
            if (this.policyViolationData.length > 0) {
                this.policyViolationData = this.policyViolationData.sort((a, b) => -(a.hourOfDay - b.hourOfDay))
            }
            this.policyViolationData.forEach(data => {
                const date = this.covertDateToUTCFormat(data.startDateTime);
                data.hourOfDay = date.getHours();

                data.hourOfDay = (data.hourOfDay < 12) ? (data.hourOfDay) + ' AM' : (data.hourOfDay % 12) + ' PM';
            });
            this.zone.runOutsideAngular(() => {

                // Initialize Bubble chart
                this.initializeBubbleChart();
            });
        });
    }

    stylePolicyActionButton(policyButtonName: string) {
        // AI Incident Created, Manual Incident Created, Create an Incident  - Incident Button Name Possibilities
        if (policyButtonName == 'AI Incident Created')
            return { background: 'darkblue', color: 'white' };
        else
            return { background: 'darkyellow', color: 'white' };
    }

    actionButtonClick(policyViolation: any) {
        // debugger
        if (this.userPermissions.includes('Incidentsummary_Control')) {
            if (policyViolation.actionButtonName != "Create an Incident") {
                this.router.navigate(['/incidentSummary', policyViolation.incidentId]);
                return;
            } else {
                var categories: Array<string[]> = [];
                var ruleIds: Array<number[]> = [];
                var violationIds: Array<number[]> = [];

                policyViolation.timeLines.forEach(timeLine => {
                    categories.push(timeLine.subCategory);
                    ruleIds.push(timeLine.ruleId);
                    violationIds.push(timeLine.lastViolationId);
                });

                const requestBody = {
                    category: categories,
                    entityId: policyViolation.entityId,
                    entityType: 'USER',
                    eventDate: policyViolation.violationEventDate,
                    ruleIds: ruleIds,
                    violationIds: violationIds
                };

                this.riskyUserService.newIncidentCreation(requestBody).subscribe(res => {
                    this.router.navigate(['/incidentSummary', res.incidentId]);
                });
            }
        }
    }

    initializeGuageMeterChart() {

        am4core.useTheme(am4themes_animated);
        // create chart
        var chart = am4core.create('chartGuageDiv', am4charts.GaugeChart);
        chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

        chart.innerRadius = -20;

        // Set cell size in pixels
        let cellSize = 30;
        chart.events.on('datavalidated', function (ev) {

            // Get objects of interest
            let chart = ev.target;
            /* let categoryAxis = chart.yAxes.getIndex(0);
        
            // Calculate how we need to adjust chart height
            let adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;
        
            // get current chart height
            let targetHeight = chart.pixelHeight + adjustHeight; */

            // Set it on chart's container
            // chart.svgContainer.htmlElement.style.height = 350 + "px";
        });

        // start and end angle
        /* chart.startAngle = 360;
        chart.endAngle = 0; */

        var axis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
        axis.min = 0;
        axis.max = 100;
        axis.strictMinMax = true;
        axis.renderer.grid.template.stroke = new am4core.InterfaceColorSet().getFor('background');
        axis.renderer.grid.template.strokeOpacity = 0.3;

        // axis.fontSize = 0;
        /* axis.hidden = false;
        axis.fixedWidthGrid = true; */

        // axis.renderer.ticks.template.length = 35;
        // axis.renderer.grid.template.disabled = true;
        axis.fontSize = 12;
        axis.renderer.labels.template.radius = 4;   // space b/w meter and number
        /* axis.renderer.labels.template.adapter.add("text", function (text) {
            return text + "%";
        }) */

        var range0 = axis.axisRanges.create();
        range0.value = 0;
        range0.endValue = 65;
        range0.axisFill.fillOpacity = 1;
        range0.axisFill.fill = am4core.color('greenyellow');
        range0.axisFill.zIndex = -1;

        var range1 = axis.axisRanges.create();
        range1.value = 65;
        range1.endValue = 79;
        range1.axisFill.fillOpacity = 1;
        range1.axisFill.fill = am4core.color('darkorange');
        range1.axisFill.zIndex = -1;

        var range2 = axis.axisRanges.create();
        range2.value = 79;
        range2.endValue = 100;
        range2.axisFill.fillOpacity = 1;
        range2.axisFill.fill = am4core.color('crimson');
        range2.axisFill.zIndex = -1;

        var hand = chart.hands.push(new am4charts.ClockHand());
        hand.value = this.userData.riskScore;
        hand.fill = am4core.color('#2D93AD');   // hand color
        hand.stroke = am4core.color('#2D93AD');

        // using chart.setTimeout method as the timeout will be disposed together with a chart
        /* chart.setTimeout((randomValue), 2000);

        function randomValue() {
            hand.showValue(this.userData.score, 1000, am4core.ease.cubicOut);
            chart.setTimeout(randomValue, 2000);
        } */
    }

    initializeBubbleChart() {

        // Apply chart themes
        am4core.useTheme(am4themes_animated);

        var chart = am4core.create('bubbleChartdiv', am4charts.XYChart);

        // Set input format for the dates
        chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';

        chart.maskBullets = false;

        let xAxis = chart.xAxes.push(new am4charts.DateAxis());
        //xAxis.dataFields.category = "date";

        let yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        yAxis.dataFields.category = 'hourOfDay';

        xAxis.dateFormats.setKey('day', 'MMM dd, yyyy');
        xAxis.periodChangeDateFormats.setKey('day', 'MMM dd, yyyy');

        xAxis.renderer.grid.template.disabled = false; // vertical line middle on the bubbles
        yAxis.renderer.grid.template.disabled = false; // Horizontal border line for the bubbles
        xAxis.renderer.axisFills.template.disabled = true; // vertical border - one by one column , not for all
        yAxis.renderer.axisFills.template.disabled = true; // horizontal border - one by one column , not for all
        yAxis.renderer.ticks.template.disabled = true;
        xAxis.renderer.ticks.template.disabled = true;

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = 'hourOfDay';
        series.dataFields.dateX = 'date';
        series.dataFields.value = 'violationsCount';
        series.columns.template.disabled = true; // background color for the columns
        series.sequencedInterpolation = true;
        series.tooltip.getFillFromObject = false;
        series.tooltip.background.fill = am4core.color('#2D93AD');
        series.defaultState.transitionDuration = 1000;

        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.tooltipText = '[bold, black]{policyName} : {violationsCount}';
        bullet.background.fill = am4core.color('black');
        bullet.strokeWidth = 2;
        bullet.stroke = am4core.color('#ffffff');
        bullet.propertyFields.fill = 'color'; // provide dynamic color for bubbles
        bullet.strokeOpacity = 0;

        series.bullets.template.interactionsEnabled = true;
        bullet.events.on(
            'hit',
            ev => {
                const item = ev.target.dataItem['dataContext'];
                this.riskyUserService.getPolicyViolationForGivenPeriod(this.selectedUser, item['startDateTime'],
                    item['endDateTime'], 0).subscribe((res: any) => {

                        if (res && res.length > 0) {
                            res.forEach((policyViolation) => {
                                policyViolation.timeLines.forEach((timeLine) => {
                                    timeLine['accord'] = false;
                                    if (timeLine.violationEventTime) {
                                        timeLine.violationTime = this.covertDateToUTCFormat(timeLine.violationEventTime)
                                    }

                                });
                            });
                            this.policyViolations = res.reverse();
                        } else {
                            this.policyViolations = [];
                        }
                    });
            }
        );

        // tooltip rendering on the bubble
        bullet.adapter.add('tooltipY', (tooltipY, target) => {
            return 1; // -target.circle.radius + 1;
        });

        // size of the bubble increment
        series.heatRules.push({ property: 'radius', target: bullet.circle, min: 6, max: 12 });

        bullet.hiddenState.properties.scale = 0.01;
        bullet.hiddenState.properties.opacity = 1;
        var hoverState = bullet.states.create('hover');
        hoverState.properties.strokeOpacity = 1;

        for (var x in this.policyViolationData) {
            if (this.policyViolationData[x].violationsCount > 0 && this.policyViolationData[x].violationsCount <= 10) {
                this.policyViolationData[x].color = '#FFFF00';
            } else if (this.policyViolationData[x].violationsCount > 10 && this.policyViolationData[x].violationsCount <= 50) {
                this.policyViolationData[x].color = '#FFA500';
            } else if (this.policyViolationData[x].violationsCount > 50) {
                this.policyViolationData[x].color = '#f00';
            }
        }

        chart.data = this.policyViolationData;

        // Add scrollbars
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarY = new am4core.Scrollbar();

        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = 'zoomXY';
    }

    covertDateToUTCFormat(inputDate) {
        const date = new Date(inputDate);
        const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        return _utc;
    }

    switchView(view) {
        this.selectedView = view;
    }

    goToPolicyViolationSummary() {
        this.router.navigateByUrl('/policyViolationSummary');
    }

    loadMoreUsers() {
        this.offset++;
        //this.getAllUsers();
    }

    open(ruilId, userId, isotimestamp) {
        const modalRef = this.modalService.open(RiskScoreModalComponent, { backdrop: 'static' }); // { size: 'sm' }
        modalRef.componentInstance.ruilId = ruilId;
        modalRef.componentInstance.userId = userId;
        modalRef.componentInstance.isotimestamp = isotimestamp;
    }

    fetchEnrichIndexKibanaURL(entityId, violationEventDateTime, ruleId) {
        if (this.userPermissions && this.userPermissions.includes('Kibanaaccess_Control'))
            this.riskyUserService.fetchEnrichIndexKibanaURL(entityId, encodeURIComponent(violationEventDateTime), ruleId, 'USER')
                .subscribe((res: any) => {
                    window.open(`${environment.kibanaLink}/goto/${res.urlId}`);
                });
    }

    fetchKibanaRawEventindex(lastViolationId) {
        /* this.riskyUserService.fetchKibanaRawEventindex(entityId, 'USER', enrichEventIds)
            .subscribe((res: any) => {
                window.open(`${environment.kibanaLink}/goto/${res.urlId}`);
            }); */
        if (this.userPermissions && this.userPermissions.includes('Kibanaaccess_Control')) {
            this.riskyUserService.rawEventCount(lastViolationId)
                .subscribe((res: any) => {
                    window.open(`${environment.kibanaLink}/goto/${res.urlId}`);
                });
        }
    }

    gotoSummery() {
        window.open('#/policyViolationSummary', '_blank');
    }

    openUserInfo(userInfo: any) {
        const modalRef = this.modalService.open(RiskyUserInfoModalComponent, { size: 'lg' });
        modalRef.componentInstance.userInfo = userInfo;
    }

    changeChartDateRange(dateRange: string) {
        this.selectedDateRange = dateRange;
    }

    getRiskScoreColor(riskScore: number) {
        if (riskScore <= 65) {
            return 'greenyellow';
        } else if (riskScore > 65 && riskScore <= 79) {
            return 'darkorange';
        } else {
            return 'crimson';
        }
    }
    getRiskColor(riskScore: number) {
        if (riskScore <= 65) {
            return 'limegreen';
        } else if (riskScore > 65 && riskScore <= 79) {
            return 'orange';
        } else {
            return 'crimson';
        }
    }
    getConfidenceColor(confidence: string) {
        if (confidence === 'HIGH') {
            return 'limegreen';
        } else if (confidence === 'MEDIUM') {
            return 'darkorange';
        } else {
            return 'crimson';
        }
    }
    timelineCreateIncident(timeline) {
        const loggedInUser = this.utilService.getLoggedInUser();

        this.caseManagementService.timelineCreateIncident(timeline.lastViolationId, encodeURIComponent(timeline.violationEventTime), loggedInUser)
            .subscribe((res: any) => {

                ++this.activities[4].value;  // update Incident value count

                this._snackBar.open('Created Incident successfully', null, {
                    duration: 2000,
                });
                if (res) {
                    // const parsedRes = JSON.parse(res);
                    timeline.incId = res.incId;
                    timeline.pvId = res.pvID;
                }
            });
    }

    createIncident(violation) {

        const date = new Date(violation.violationEventTime);
        //console.log(date.toISOString().substring(0, 19));

        const incidentData = {
            'status': 'NEW',
            "entityId": this.selectedUser,
            "ruleId": violation.ruleId,
            "violationEventDate": date.toISOString().substring(0, 10),
            "violationEventTime": date.toISOString().substring(0, 19)
        };
        this.caseManagementService.createIncident(incidentData).subscribe((res: any) => {

            this._snackBar.open('Created Incident successfully', null, {
                duration: 2000,
            });
            if (res) {
                const parsedRes = JSON.parse(res);
                violation.incId = parsedRes.incId;
                violation.pvId = parsedRes.pvID;
            }
        });
    }

    toggleAccord(item){
        item.accord = !item.accord;
        item.subAccord = false;
    }

    showChart(item,ind, i){
        item.subAccord = !item.subAccord
        if(item.subAccord){
            if(item.timelineStats.chartObjects){
                setTimeout(() => {
                   /*  if(item.chartData.option1){
                        Highcharts.chart('container1'+ind, item.chartData.option1);
                    } */
                    if(item.timelineStats.chartObjects.modelStats){
                        this.updateChartData(barChartData, item.timelineStats.chartObjects.modelStats);
                        Highcharts.chart('container2'+ind +i , barChartData);
                    }
                   /*  if(item.chartData.option3){
                        Highcharts.chart('container3'+ind, item.chartData.option3);
                    } */
   
                }, 100);
               
            }
        }
    }

    updateChartData(chartData, itemData){
        chartData.xAxis.categories = itemData.attributes;
        let seriesData = [];
        let index;
        for(var i = 0; i <=itemData.attributeValues.length-1; i++){
            let data = {y : itemData.attributeValues[i], color : ChartColors[i]};
            if(seriesData.length == 0){
                index = 0;
            }else{
                index = seriesData.length;
            }
            seriesData.splice(index, 0, data);
        }
        chartData.series[0].data = seriesData;
    }
}
