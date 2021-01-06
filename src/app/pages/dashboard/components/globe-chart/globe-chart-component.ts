import { Component, Input, NgZone, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as Highcharts from 'highcharts';
import { DashboardService } from '../../dashboard.service';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import { environment } from '../../../../../environments/environment';

am4core.useTheme(am4themes_animated);

@Component({
    selector: 'globe-chart',
    templateUrl: './globe-chart.component.html'
})
export class GlobeChartComponent implements OnInit {


    @Input() componentType: string;
    riskScoreByDepartments = [];
    riskScoreByTitles = [];
    riskScoreByTitleCount = [];
    noRiskByTitle = false;
    noRiskByDept = false;
    noRiskByLocation = false;
    riskCountByLocation = {};
    color = ['cadetblue', 'deepskyblue', 'palegreen', 'darkcyan', 'lightcoral'];

    public options: any = {
        credits: {
            enabled: false
        },
        colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
            '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
        chart: {
            backgroundColor: '#0D1726',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            align: 'left',
            style: { color: '#a0a0a0', fontWeight: 'bold', fontFamily: 'roboto' },
            text: 'RISK BY DEPARTMENT',
            x: 8,
            y: 24
        },
        tooltip: {
            pointFormat: '{point.percentage:.0f}%'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
                        },
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            location.href = this.options.url;
                        }
                    }
                }
            }
        },
        legend: {
            itemStyle: {
                color: '#E0E0E3',
                fontWeight: 'none'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        series: [{
            colorByPoint: true,
            data: [
                {
                    name: 'IT Security', y: 61, sliced: true,
                    selected: true
                },
                { name: 'Infrastructure', y: 12 },
                { name: 'IT Support', y: 11 },
                { name: 'Quality Testing', y: 5 },
                { name: 'Development', y: 5 },
                { name: 'HR', y: 7 }
            ]
        }]
    }; // required

    public riskByTitleOptions: any = {
        credits: {
            enabled: false
        },

        chart: {
            backgroundColor: '#0D1726',
            type: 'column'
        },
        title: {
            align: 'left',
            style: { color: '#a0a0a0', fontWeight: 'bold', fontFamily: 'roboto' },
            text: 'RISK BY TITLE',
            x: 8,
            y: 24
        },
        xAxis: {
            categories: [
                'VP-Sales', 'Software Engineer', 'Sr. Tester', 'Project Manager', 'Product Owner'
            ],
            labels: {
                step: 1,
                width: '20px',
                style: { color: '#fff' }
            }
        },
        yAxis: {
            min: 0,
            lineWidth: 0,
            minorGridLineWidth: 0,
            gridLineColor: 'transparent',
            title: {
                style: { color: '#fff' },
                text: 'User Count'
            },
            labels: {
                style: { color: '#fff' },
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y:1f}</b>'
        },
        legend: {
            itemStyle: {
                color: '#E0E0E3',
                fontWeight: 'none'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            },
            showInLegend: false,
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            location.href = this.options.url;
                        }
                    }
                }
            }
        },
        series: [{
            showInLegend: false,
            name: 'User Count',
            data: [{ y: 65, color: '#2b908f'},
            { y: 80, color: '#90ee7e' },
            { y: 75, color: '#7798BF' },
            { y: 35, color: '#55BF3B' },
            { y: 65, color: '#DF5353' }]

        }]
    };

    constructor(private zone: NgZone, private dashboardService: DashboardService) {
               
        window.scrollTo(0, 0);
    }

    ngOnInit(): void {
        switch (this.componentType) {
            case 'riskByTitle':
                this.initializeRiskByTitle();
                break;
            case 'riskByDept':
                this.initializeRiskByDept();
                break;
            case 'riskByLocation':
                this.initializeRiskByLocation();
                break;
        }
    }

    initializeRiskByTitle() {
        this.dashboardService.getRiskCountByTitle().subscribe((res: any) => {
            if (res && res.length > 0) {
                let i = 0;
                res.forEach(riskScoreByTitleObj => {
                    this.riskScoreByTitles.push(riskScoreByTitleObj.title);
                    this.riskScoreByTitleCount.push({ y: riskScoreByTitleObj.riskScoreCount, color: this.color[i] , url: '/#/global-search/entities?filterTitle='+ riskScoreByTitleObj.title });
                    i++;
                });
                this.riskByTitleOptions.xAxis.categories = this.riskScoreByTitles;
                this.riskByTitleOptions.series[0].data = this.riskScoreByTitleCount;
                Highcharts.chart('riskByTitleContainer', this.riskByTitleOptions);
            } else {
                this.noRiskByTitle = true;
            }

        });
    }

    initializeRiskByDept() {
        this.dashboardService.getRiskCountByDepartment().subscribe((res: any) => {
            if (res && res.length > 0) {
                res.forEach(riskScoreByDept => {
                    this.riskScoreByDepartments.push({ 'name': riskScoreByDept.departName, 'y': riskScoreByDept.riskScoreCount, 'url': '/#/global-search/entities?filterDept=' + riskScoreByDept.departName });
                });
                this.options.series[0].data = this.riskScoreByDepartments;
                Highcharts.chart('container', this.options);
            } else {
                this.noRiskByDept = true;
            }
        });
    }

    initializeRiskByLocation() {
        this.dashboardService.getRiskCountByLocation().subscribe((res: any) => {
            if (res && res.length > 0) {
                res.forEach(countryData => {
                    this.riskCountByLocation[countryData.countryCode.toUpperCase()] = countryData.riskScoreCount;
                });
                this.zone.runOutsideAngular(() => {
                    this.initializeGlobeChart();
                });
            } else {
                this.noRiskByLocation = true;
            }

        });
    }

    initializeGlobeChart() {
        const that = this;
        const chart = am4core.create('globeMap', am4maps.MapChart);
        chart.geodata = am4geodata_worldLow; // am4geodata_worldHigh
        chart.projection = new am4maps.projections.Miller(); // Mercator

        // Create polygon series
        const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.useGeodata = true;
        polygonSeries.exclude = ['AQ']; // Exclude Antractica
        polygonSeries.tooltip.fill = am4core.color('#000000');
        polygonSeries.mapPolygons.template.fill = am4core.color('#225DA2'); // city fill color
        polygonSeries.mapPolygons.template.stroke = am4core.color('#225DA2'); // city border
        polygonSeries.useGeodata = true;
        polygonSeries.calculateVisualCenter = true;
        polygonSeries.tooltip.background.fillOpacity = 0.2;
        polygonSeries.tooltip.background.cornerRadius = 20;

        const template = polygonSeries.mapPolygons.template;
        template.nonScalingStroke = true;
        template.fill = am4core.color('#007ad9');
        template.stroke = am4core.color('#007ad9');

        polygonSeries.calculateVisualCenter = true;
        template.propertyFields.id = 'id';
        template.tooltipPosition = 'fixed';
        template.fillOpacity = 1;

        template.events.on('over', function (event) {
            if (event.target.dummyData) {
                event.target.dummyData.isHover = true;
            }
        });
        template.events.on('out', function (event) {
            if (event.target.dummyData) {
                event.target.dummyData.isHover = false;
            }
        });

        const hs = polygonSeries.mapPolygons.template.states.create('hover');
        hs.properties.fillOpacity = 1;
        hs.properties.fill = am4core.color('#76b7ea');

        // Disable zoom and pan
        chart.maxZoomLevel = 1;
        chart.seriesContainer.draggable = false;
        chart.seriesContainer.resizable = false;

        const measelsSeries = chart.series.push(new am4maps.MapPolygonSeries());
        measelsSeries.tooltip.background.fillOpacity = 0;
        measelsSeries.tooltip.background.cornerRadius = 20;
        measelsSeries.tooltip.autoTextColor = true;
        measelsSeries.tooltip.label.fill = am4core.color('#000');
        measelsSeries.tooltip.dy = -5;

        const measelTemplate = measelsSeries.mapPolygons.template;
        measelTemplate.fill = am4core.color('red');
        measelTemplate.strokeOpacity = 0;
        measelTemplate.fillOpacity = 0.75;
        measelTemplate.tooltipPosition = 'fixed';

        const hs2 = measelsSeries.mapPolygons.template.states.create('hover');
        hs2.properties.fillOpacity = 1;
        hs2.properties.fill = am4core.color('#86240c');

        polygonSeries.events.on('inited', function () {
            polygonSeries.mapPolygons.each(function (mapPolygon) {
                let count = that.riskCountByLocation[mapPolygon.id];

                if (count > 0) {
                    let polygon = measelsSeries.mapPolygons.create();
                    polygon.multiPolygon = am4maps.getCircle(mapPolygon.visualLongitude, mapPolygon.visualLatitude, Math.max(0.2, Math.log(count) * Math.LN10 / 10));
                    polygon.tooltipText = mapPolygon.dataItem.dataContext['name'] + ': ' + count;
                    mapPolygon.dummyData = polygon;
                    polygon.events.on('over', function () {
                        mapPolygon.isHover = true;
                    });
                    polygon.events.on('out', function () {
                        mapPolygon.isHover = false;
                    });
                } else {
                    //mapPolygon.tooltipText = mapPolygon.dataItem.dataContext.name + ": no data";
                    mapPolygon.fillOpacity = 0.9;
                }

            });
        });
    }

}
