import { Component, NgZone, OnInit, AfterContentInit, Inject } from '@angular/core';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { RiskyUserService } from '../riskyUsers/riskyUser.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RiskScoreModalComponent } from '../riskyUsers/risk-score-modal/risk-score-modal.component';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4charts from '@amcharts/amcharts4/charts';
import { environment } from '../../../../../environments/environment';
import { CaseManagementService } from '../../../case-management/case-management.service';
import { MatSnackBar } from '@angular/material';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { barChartData, ChartColors} from '../riskyUsers/data';
import * as Highcharts from 'highcharts';
// import highcharts3D from 'highcharts/highcharts-3d.src';
// highcharts3D(Highcharts);

@Component({
    selector: 'app-riskyHost',
    templateUrl: './riskyHost.component.html',
    styleUrls: ['./riskyHost.component.scss']
})
export class RiskyHostComponent implements OnInit {

    userPermissions = [];

    selectedHost: string;
    hostDetails: any;
    policyViolations: any;
    graphData: any;

    actionButtonName = '';

    constructor(private amChartService: AmChartsService, private riskyUserService: RiskyUserService, private _snackBar: MatSnackBar,
        private routeParam: ActivatedRoute, private modalService: NgbModal, private caseManagementService: CaseManagementService,
        private zone: NgZone, private router: Router, @Inject(SESSION_STORAGE) private sessionStorage: StorageService) {

        window.scrollTo(0, 0);
        this.userPermissions = JSON.parse(this.sessionStorage.get('userPermissions'));
    }

    ngOnInit() {
        this.routeParam.paramMap.subscribe((params) => {
            this.selectedHost = params.get('selectedHost');
            this.getRiskyHostDetails();
        });
    }

    initializeGuageMeterChart() {

        am4core.useTheme(am4themes_animated);
        // create chart
        var chart = am4core.create('chartGuageDiv', am4charts.GaugeChart);
        chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

        chart.innerRadius = -15;
        chart.fill = am4core.color('red');
        // chart.colors = am4core.color('red');

        // Set cell size in pixels
        let cellSize = 80;
        chart.events.on('datavalidated', function (ev) {

            // Get objects of interest
            let chart = ev.target;
            let categoryAxis = chart.yAxes.getIndex(0);

            // Calculate how we need to adjust chart height
            let adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;

            // get current chart height
            let targetHeight = chart.pixelHeight + adjustHeight;

            // Set it on chart's container
            chart.svgContainer.htmlElement.style.height = targetHeight + "px";
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
        hand.value = this.hostDetails.riskScore;
        hand.fill = am4core.color('#2D93AD');   // hand color
        hand.stroke = am4core.color('#2D93AD');

        // using chart.setTimeout method as the timeout will be disposed together with a chart
        /* chart.setTimeout((randomValue), 2000);

        function randomValue() {
            hand.showValue(this.userData.score, 1000, am4core.ease.cubicOut);
            chart.setTimeout(randomValue, 2000);
        } */
    }

    actionButtonClick(policyViolation: any) {
        if (this.userPermissions.includes('Incidentsummary_Control')) {
            if (this.actionButtonName != "Create an Incident")
                this.router.navigate(['/incidentSummary', policyViolation.incidentId]);
            else {
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
                    entityType: 'HOST',
                    eventDate: policyViolation.violationEventDate,
                    ruleIds: ruleIds,
                    violationIds: violationIds
                };
                //console.log('request body : ' + requestBody);
                this.riskyUserService.newIncidentCreation(requestBody).subscribe(res => {
                    this.router.navigate(['/incidentSummary', res.incidentId]);
                });
            }
        }
    }

    initializeLineChart() {

        am4core.useTheme(am4themes_animated);
        // Themes end

        let chart = am4core.create("lineChartDiv", am4charts.XYChart);
        chart.paddingRight = 20;
        chart.data = this.graphData;

        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.axisFills.template.disabled = true;
        dateAxis.renderer.ticks.template.disabled = true;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minWidth = 35;
        valueAxis.renderer.axisFills.template.disabled = true;
        valueAxis.renderer.ticks.template.disabled = true;

        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "riskScore";
        series.strokeWidth = 2;
        series.tooltipText = "Risk Score: {valueY}";

        // set stroke property field
        series.propertyFields.stroke = "color";

        chart.cursor = new am4charts.XYCursor();

        let scrollbarX = new am4core.Scrollbar();
        chart.scrollbarX = scrollbarX;

    }

    stylePolicyActionButton(policyButtonName: string) {
        // AI Incident Created, Manual Incident Created, Create an Incident  - Incident Button Name Possibilities
        if (policyButtonName == 'AI Incident Created')
            return { background: 'darkblue', color: 'white' };
        else
            return { background: 'darkyellow', color: 'white' };
    }

    getRiskyHostDetails() {
        this.riskyUserService.getRiskyEntityDetails(this.selectedHost, 'HOST').subscribe((res: any) => {

            res.riskScore = Math.round(res.riskScore);
            this.hostDetails = res;
            this.initializeGuageMeterChart();
        });
        const date = new Date()
        this.riskyUserService.getPolicyViolationForGivenPeriod(this.selectedHost, 0, date.getTime(), 0).subscribe((res: any) => {

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
                    policyViolation.timeLines.forEach((timeLine) => {
                        timeLine['accord'] = false;
                    });
                });
                this.policyViolations = res.reverse();
            }
        });

        this.riskyUserService.getDayBasisRiskScore(this.selectedHost).subscribe((res: any) => {

            this.graphData = res;
            this.zone.runOutsideAngular(() => {
                this.initializeLineChart();
            });
        });
    }

    getRiskScoreColor(riskScore: number) {
        if (riskScore <= 65)
            return "greenyellow";
        else if (riskScore > 65 && riskScore <= 79)
            return "darkorange";
        else
            return "crimson";
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
    open(ruilId, userId, isotimestamp) {
        const modalRef = this.modalService.open(RiskScoreModalComponent, { backdrop: 'static' }); // { size: 'sm' }
        modalRef.componentInstance.ruilId = ruilId;
        modalRef.componentInstance.userId = userId;
        modalRef.componentInstance.isotimestamp = isotimestamp;
    }

    gotoSummery() {
        //window.open("#/policyViolationSummary", '_blank');
    }

    fetchEnrichIndexKibanaURL(entityId, violationEventDateTime, ruleId) {
        if (this.userPermissions.includes('Kibanaaccess_Control'))
            this.riskyUserService.fetchEnrichIndexKibanaURL(entityId, encodeURIComponent(violationEventDateTime), ruleId, 'HOST')
                .subscribe((res: any) => {
                    window.open(`${environment.kibanaLink}/goto/${res.urlId}`);
                });
    }

    fetchKibanaRawEventindex(lastViolationId) {
        /* this.riskyUserService.fetchKibanaRawEventindex(entityId, 'HOST', enrichEventIds)
            .subscribe((res: any) => {
                window.open(`${environment.kibanaLink}/goto/${res.urlId}`);
            }); */

        if (this.userPermissions.includes('Kibanaaccess_Control')) {
            this.riskyUserService.rawEventCount(lastViolationId)
                .subscribe((res: any) => {
                    window.open(`${environment.kibanaLink}/goto/${res.urlId}`);
                });
        }
    }

    createIncident(violation) {

        const date = new Date(violation.violationEventTime);
        const incidentData = {
            'status': 'NEW',
            "entityId": this.selectedHost,
            "ruleId": violation.ruleId,
            "violationEventDate": date.toISOString().substring(0, 10),
            "violationEventTime": date.toISOString().substring(0, 19)
        };
        this.caseManagementService.createIncident(incidentData).subscribe((res: any) => {

            this._snackBar.open('Created Incident successfully', null, {
                duration: 2000,
            });
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
