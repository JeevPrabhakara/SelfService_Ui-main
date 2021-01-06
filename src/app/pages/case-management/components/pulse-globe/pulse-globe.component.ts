import { Component, OnInit, NgZone, ViewChild } from "@angular/core";
import { HostBinding, ElementRef } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4geodata_worldHigh from "@amcharts/amcharts4-geodata/worldHigh";
import { Table } from "primeng/table";
import { sampleMapData, sampleMapData1, sourceData, destinationData } from "./data";
am4core.useTheme(am4themes_animated);

@Component({
    selector: "app-pulse-globe",
    templateUrl: "./pulse-globe.component.html"
})
export class PulseGlobeComponent implements OnInit {
    @ViewChild('fs') fs: ElementRef;
    @HostBinding('class.is-fullscreen') isFullscreen = false;
    isActive = false;

    @ViewChild("attack") attack: Table;

    private am4maps: am4maps.MapChart;
    liveAttacks: any[] = [];
    source: any[] = [];
    destination: any[] = [];
    dummyAttacks: any[] = [];
    counter: number = 0;
    chart: any;

    datas = sampleMapData;
    constructor(private zone: NgZone) {
        window.scrollTo(0, 0);
        this.source = sourceData;
        this.destination = destinationData;
    }

    ngOnInit() {
        setInterval(() => {
            this.counter = 0;
            setInterval(() => {
                this.counter++;
                let data = sampleMapData1[this.counter];
                if (data) {
                    sampleMapData.unshift(data);
                }
            }, 500);
        }, 1000);
    }

    initializePlainGlobe() {
        // Create map instance
        this.chart = am4core.create("pulseGlobeChartDiv", am4maps.MapChart);
        am4core.options.autoSetClassName = true;
        // Set map definition
        this.chart.geodata = am4geodata_worldLow; // am4geodata_worldHigh

        // Set projection
        this.chart.projection = new am4maps.projections.Miller(); // Mercator

        // Create polygon series
        var polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.useGeodata = true;
        polygonSeries.exclude = ["AQ"]; // Exclude Antractica
        polygonSeries.tooltip.fill = am4core.color("#000000");

        polygonSeries.mapPolygons.template.fill = am4core.color("#225DA2"); // city fill color
        polygonSeries.mapPolygons.template.stroke = am4core.color("#000"); // city border

        var colorSet = new am4core.ColorSet();
        let gradient = new am4core.LinearGradient();
        gradient.addColor(am4core.color("#0A7B8E"));
        //gradient.addColor(am4core.color("#0028E8"));
        gradient.addColor(am4core.color("#0959A2"));

        // Configure polygons
        var polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}";
        polygonTemplate.togglable = true;
        //polygonTemplate.fill = gradient;

        // Set events to apply "active" state to clicked polygons
        /* var currentActive;
        polygonTemplate.events.on("hit", function(event) {
            // if we have some country selected, set default state to it
            if (currentActive) {
                currentActive.setState("default");
            }
            chart.maxZoomLevel = 32;
            chart.zoomToMapObject(event.target);
            currentActive = event.target;
            chart.maxZoomLevel = 1;
        }); */

        // Configure states
        // @see {@link https://www.amcharts.com/docs/v4/concepts/states/}

        // Configure "hover" state
        var hoverState = polygonTemplate.states.create("hover");
        hoverState.properties.fill = colorSet.getIndex(0);

        // Configure "active" state
        var activeState = polygonTemplate.states.create("active");
        activeState.properties.fill = colorSet.getIndex(4);

        // Disable zoom and pan
        //chart.maxZoomLevel = 1;
        this.chart.seriesContainer.draggable = true;
        this.chart.seriesContainer.resizable = false;

        //this.chart.zoomControl = new am4maps.ZoomControl();
        //chart.zoomControl.zoomIn();
        // get data
        // const data = sampleMapData;

        // Export - img, pdf
        // chart.exporting.menu = new am4core.ExportMenu();

        // Zoom control
        /*  chart.zoomControl = new am4maps.ZoomControl();

        var homeButton = new am4core.Button();
        homeButton.events.on("hit", function () {
            chart.goHome();
        });

        homeButton.icon = new am4core.Sprite();
        homeButton.padding(7, 5, 7, 5);
        homeButton.width = 30;
        homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
        homeButton.marginBottom = 10;
        homeButton.parent = chart.zoomControl;
        homeButton.insertBefore(chart.zoomControl.plusButton);

        // Center on the groups by default
        chart.homeZoomLevel = 3.5;
        chart.homeGeoPoint = { longitude: 10, latitude: 52 }; // 10,52 - original

        chart.geodata = am4geodata_worldLow;
        chart.projection = new am4maps.projections.Miller();
        chart.homeZoomLevel = .5;
        chart.homeGeoPoint = {
            latitude: 30,  // 38   - from top side
            longitude: 5 // -60   - from left side
        }; */

        // Create map polygon series
        /* var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.useGeodata = true;
        // polygonSeries.mapPolygons.template.fill = chart.colors.getIndex(0).lighten(0.5);
        polygonSeries.mapPolygons.template.fill = am4core.color("#225DA2");
        polygonSeries.mapPolygons.template.stroke = am4core.color("#225DA2"); // countries border lines
        polygonSeries.mapPolygons.template.nonScalingStroke = true;
        polygonSeries.exclude = ["AQ"];
 */
        // Add line bullets
        var cities = this.chart.series.push(new am4maps.MapImageSeries());
        cities.mapImages.template.nonScaling = true;
        cities.zIndex = 20;

        var city = cities.mapImages.template.createChild(am4core.Sprite);
        city.scale = 0.7;
        city.horizontalCenter = "middle";
        city.verticalCenter = "middle";
        city.path = "M16,0.07875 C18.0342854,0.0787448404 19.9850007,0.88804038 21.4218388,2.32811452 C22.8586768,3.76818866 23.6635817,5.72071978 23.659,7.755 C23.659,12.73335 17.3317,20.06115 16,24.0735 C14.6683,20.0784 8.341,12.7506 8.341,7.755 C8.33641828,5.72071978 9.14132321,3.76818866 10.5781612,2.32811452 C12.0149993,0.88804038 13.9657146,0.0787448404 16,0.07875 Z M16,11.11875 C18.0959206,11.11875 19.795,9.41967063 19.795,7.32375 C19.795,5.22782937 18.0959206,3.52875 16,3.52875 C13.9040794,3.52875 12.205,5.22782937 12.205,7.32375 C12.205,9.41967063 13.9040794,11.11875 16,11.11875 Z M20.03995,23.8182 C26.6536,24.17355 31.525,25.38105 31.525,26.81625 C31.525,28.54125 24.57325,29.92125 16,29.92125 C7.42675,29.92125 0.475,28.54125 0.475,26.81625 C0.475,25.38105 5.3464,24.17355 11.96005,23.8182 C10.22815,24.08385 9.1,24.5151 9.1,25.005 C9.1,25.81575 12.205,26.47125 16,26.47125 C19.795,26.47125 22.9,25.81575 22.9,25.005 C22.9,24.5082 21.76495,24.08385 20.03995,23.8182 Z";
        city.fill = am4core.color('#F5A623');
        city.strokeOpacity = 0;

        function addCity(coords, title) {
            var city = cities.mapImages.create();
            city.latitude = coords.latitude;
            city.longitude = coords.longitude;
            city.tooltipText = title;
            return city;
        }

        let sourceArr: any[] = [];
        let i = 0;
        this.source.forEach(map => {
            sourceArr[i] = addCity({ "latitude": map.latitude, "longitude": map.longitude }, map.source);
            i++;
        });

        var desCities = this.chart.series.push(new am4maps.MapImageSeries());
        desCities.mapImages.template.nonScaling = true;
        desCities.zIndex = 20;

        var desCity = desCities.mapImages.template.createChild(am4core.Sprite);
        desCity.scale = 0.8;
        desCity.horizontalCenter = "middle";
        desCity.verticalCenter = "middle";
        desCity.path = "M13.9789477,11.8424551 C12.7977746,11.8424551 11.8425231,12.7977066 11.8425231,13.9773151 C11.8425231,15.1585562 12.7977746,16.1153044 13.9789477,16.1153044 C15.1586242,16.1153044 16.1153724,15.1585562 16.1153724,13.9773151 C16.1153724,12.7977066 15.1586242,11.8424551 13.9789477,11.8424551 Z M25.1095127,12.9632872 C24.6250161,7.60783761 20.3491055,3.3311107 14.9937239,2.84661408 L14.9937239,0.0492957746 L12.9632872,0.0492957746 L12.9632872,2.84661408 C7.60783761,3.3311107 3.33199507,7.60783761 2.84661408,12.9632872 L0.0492957746,12.9632872 L0.0492957746,14.9937239 L2.84661408,14.9937239 C3.33199507,20.3499899 7.60783761,24.6250161 12.9632872,25.110397 L12.9632872,27.9085997 L14.9937239,27.9085997 L14.9937239,25.110397 C20.3491735,24.6250161 24.6250161,20.3499899 25.1095127,14.9937239 L27.9077154,14.9937239 L27.9077154,12.9632872 L25.1095127,12.9632872 Z M23.06962,14.9937239 C22.5998175,19.2290217 19.2290217,22.6006338 14.9937239,23.0705044 L14.9937239,19.4103848 L12.9632872,19.4103848 L12.9632872,23.0705044 C8.72798944,22.6006338 5.35637732,19.2290217 4.88650676,14.9937239 L8.54662634,14.9937239 L8.54662634,12.9632872 L4.88650676,12.9632872 C5.3563093,8.72798944 8.72798944,5.35637732 12.9632872,4.88650676 L12.9632872,8.54662634 L14.9937239,8.54662634 L14.9937239,4.88650676 C19.2290217,5.3563093 22.5998175,8.72798944 23.06962,12.9632872 L19.4103848,12.9632872 L19.4103848,14.9937239 L23.06962,14.9937239 Z";
        desCity.fill = am4core.color('#FF5A5A');
        desCity.strokeOpacity = 0;

        function addDestCity(coords, title) {
            var city = desCities.mapImages.create();
            city.latitude = coords.latitude;
            city.longitude = coords.longitude;
            city.tooltipText = title;
            return city;
        }

        let destinationArr: any[] = [];
        let j = 0;
        this.destination.forEach(map => {
            destinationArr[j] = addDestCity({ "latitude": map.latitude, "longitude": map.longitude }, map.destination);
            j++;
        })
        var totalLocation = destinationArr.length;

        // // Add lines
        var lineSeries = this.chart.series.push(new am4maps.MapArcSeries());
        //lineSeries.mapLines.template.line.strokeWidth = 2.5;
        //lineSeries.mapLines.template.line.strokeOpacity = 0.5;
        //lineSeries.mapLines.template.line.stroke = city.fill;
        //lineSeries.mapLines.template.line.fill = am4core.color('#FCD94E'); // color between up and down flight shadow
        lineSeries.mapLines.template.line.nonScalingStroke = true;
        lineSeries.mapLines.template.line.strokeOpacity = 0;
        //lineSeries.mapLines.template.line.strokeDasharray = "1,1";
        lineSeries.zIndex = 0;

        var shadowLineSeries = this.chart.series.push(new am4maps.MapLineSeries());
        shadowLineSeries.mapLines.template.line.strokeWidth = 2;
        shadowLineSeries.mapLines.template.line.strokeOpacity = 1;
        shadowLineSeries.mapLines.template.fill = am4core.color('#FCD94E');
        shadowLineSeries.mapLines.template.line.nonScalingStroke = true;
        shadowLineSeries.mapLines.template.shortestDistance = false;
        shadowLineSeries.zIndex = 5;

        function addLine(from, to, frequency) {
            var line = lineSeries.mapLines.create();
            line.imagesToConnect = [from, to];
            line.line.controlPointDistance = -0.3;
            //line.stroke = am4core.color('#'+(Math.random()*0xFFFFFF<<0).toString(16));

            if (frequency == "High") {
                line.stroke = am4core.color('#da4c6d');
                line.line.strokeWidth = 7;
            }
            else if (frequency == "Low") {
                line.stroke = am4core.color('#f89f3c');
                line.line.strokeWidth = 1;
            }
            else {
                line.stroke = am4core.color('#ff4bbf');
                line.line.strokeWidth = 4;
            }

            /*
            var shadowLine = shadowLineSeries.mapLines.create();
            shadowLine.imagesToConnect = [from, to];
            */
            return line;
        }

        i = 0;
        this.destination.forEach(map => {
            addLine(sourceArr[i], destinationArr[i], map.frequency);
            i++;
        });

        let animation: any[] = [];
        let plane: any[] = [];
        let planeImage: any[] = [];
        i = 0;
        this.destination.forEach(map => {
            //animateSorToDest(i);
            i++;
        });

        function startAttackAnimation() {
            for (i = 0; i < totalLocation; i++) {

                plane[i] = lineSeries.mapLines.getIndex(0).lineObjects.create();
                plane[i].position = 0;
                //plane[i].width = 48; 
                //plane[i].height = 48;
                plane[i].opacity = 1;

                plane[i].adapter.add("scale", (scale, target) => {

                    //target.opacity = (0.8 - (Math.abs(0.5 - target.position)));
                    //var scaleVal = 1;
                    var scaleVal = 1 * (1 - (Math.abs(0.2 - target.position)));
                    //console.log(scaleVal);
                    return scaleVal;
                })

                planeImage[i] = plane[i].createChild(am4core.Sprite);
                planeImage[i].scale = 0.3;
                planeImage[i].horizontalCenter = "middle";
                planeImage[i].verticalCenter = "middle";
                planeImage[i].height = "30";
                planeImage[i].path = "m116.637,159.108c-0.463,-0.01 -0.262,0.585 -0.262,-0.841l0.562,0l0,0c0,0 -0.621,-0.03 -0.161,-0.04l117.722,-6.063l8.229,0.02c1.377,-0.034 14.45,1.791 14.462,6.02c0,0.021 0,0.044 0,0.063l0,0l0,0c0,4.229 -11.952,6.452 -13.325,6.452c-0.008,0 -0.678,-0.023 -0.686,-0.023";
                //planeImage[i].path = "M51,153c-28.05,0-51,22.95-51,51s22.95,51,51,51s51-22.95,51-51S79.05,153,51,153z";

                planeImage[i].fill = am4core.color('#f89f3c');
                planeImage[i].strokeOpacity = 0;

                // Plane animation
                var currentLine;
                var from, to;
                from = 0
                to = 1;
                currentLine = i;
                // Get current line to attach plane to
                plane[i].mapLine = lineSeries.mapLines.getIndex(currentLine);
                plane[i].parent = lineSeries;

                plane[i].animate({
                    from: from,
                    to: to,
                    property: "position"
                }, 4000, am4core.ease.linear);
            }
        }
        // Go!
        startAttackAnimation();

        setInterval(() => {
            for (i = 0; i < totalLocation; i++) {
                plane[i].opacity = 0;
            }
            startAttackAnimation();
        }, 4000);
    }

    fullScreen() {
    }

    openFullscreen(): void {
        this.isFullscreen = true;
        const el = this.fs.nativeElement;
        if (!document.fullscreenElement) {  // current working methods
            if (el.requestFullscreen) {
                el.requestFullscreen();
            }
            else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
            }
            else if (el.webkitRequestFullscreen) {
                // el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
            else if (el.msRequestFullscreen) {
                el.msRequestFullscreen();
            }
        }

        setTimeout(() => {
            this.isActive = true;
        }, 500);
    }

    closeFullscreen(): void {
        this.isFullscreen = false;
        this.isActive = false;
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    zoomIn() {
        this.chart.zoomIn();
        //console.log("Zoom In");
    }

    zoomOut() {
        this.chart.zoomOut();
        //console.log("Zoom Out");
    }

    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            // this.initializeGlobe();

            this.initializePlainGlobe();
        });
    }

    ngOnDestroy() {
        this.zone.runOutsideAngular(() => {
            if (this.am4maps) {
                this.am4maps.dispose();
            }
        });
    }

}

