import { Component, OnInit, NgZone, Input } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'app-risky-entity-view',
  templateUrl: './risky-entity-view.html',
  styleUrls: ['./risky-entity-view.scss']
})
export class RiskyEntityViewComponent {

  @Input('filteredRiskyEntity') entity: any;
  @Input('index') indexVal: any;

  constructor(private zone: NgZone) {
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // Initialize Guage meter chart
      //this.initializeGuageMeterChart();
    });
  }

  getRiskScoreColor(riskScore: number) {
    if (riskScore <= 65)
      return "limegreen";
    else if (riskScore > 65 && riskScore <= 79)
      return "darkorange";
    else
      return "crimson";
  }

  initializeGuageMeterChart() {
    //console.log('Chart Init');
    am4core.useTheme(am4themes_animated);
    // create chart
    var chart = am4core.create("chartGuageDiv" + this.indexVal, am4charts.GaugeChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    chart.innerRadius = 20;


    var axis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis.min = 0;
    axis.max = 1000;
    axis.strictMinMax = true;
    axis.fontSize = 0;
    axis.renderer.grid.template.strokeWidth = 2;

    var range0 = axis.axisRanges.create();
    range0.value = 0;
    range0.endValue = 400;
    range0.axisFill.fillOpacity = 1;
    range0.axisFill.fill = am4core.color('greenyellow')
    range0.axisFill.zIndex = - 1;

    var range1 = axis.axisRanges.create();
    range1.value = 300;
    range1.endValue = 600;
    range1.axisFill.fillOpacity = 1;
    range1.axisFill.fill = am4core.color('darkorange')
    range1.axisFill.zIndex = -1;

    var range2 = axis.axisRanges.create();
    range2.value = 600;
    range2.endValue = 1000;
    range2.axisFill.fillOpacity = 1;
    range2.axisFill.fill = am4core.color('crimson')
    range2.axisFill.zIndex = -1;

    var hand = chart.hands.push(new am4charts.ClockHand());
    hand.fill = am4core.color("#FFF");   // hand color
    hand.stroke = am4core.color("#FFF");

    hand.showValue(this.entity.riskScore);
    //chart.setTimeout(randomValue, 2000);

    function randomValue() {
      hand.showValue(65, 1000, am4core.ease.cubicOut);
      //chart.setTimeout(randomValue, 2000);
    }
  }

}
