import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { intToString } from '../../../../shared/utils/util-functions';
import { environment } from '../../../../../environments/environment';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
highcharts3D(Highcharts);

@Component({
  selector: 'app-dashboard-count',
  templateUrl: './dashboard-count.component.html'
})
export class DashboardCountComponent implements OnInit {

  loadingInProgress = true;
  dashboardCounts = [];
  intToString = intToString;

  ingestedData = {
    events: 0,
    users: 0,
    resources: 0,
    entitlements: 0,
    srcIP: 0,
    hosts: 0,
    url: 0
  }
  riskyData = {
    riskyUsers: 0,
    alert: 0,
    riskyHostname: 0,
    riskyURL: 0,
    riskySrcIP: 0,
    oIncManual: 0,
    oIncAuto: 0,
    remdAuto: 0,
    remdManual: 0,
    trtCatMitre: 0,
    trtCatNist: 0

  }

  incidentResponder = {
    aiPrediction: 13,
    triggeredModels: 0,
    highConfidenceTriggeredModels: 0,
    lowConfidenceTriggeredModels: 0,
    enabledModels: 0,
    highConfidence: 0,
    lowConfidence: 0,
    closedIncidents: 0,
    truePositive: 0,
    falsePositive: 0,
    wrongDetection: 0
  }

  // public aiChartOption:any = {
  //   credits : {
  //     enabled : false
  // },
  // colors: ['#06ad4e', '#313a4a'],
  // chart: {
  //     backgroundColor: '#0D1726',
  //     type: 'column',
  //     options3d: {
  //       enabled: true,
  //       alpha: 5,
  //       beta: 20,
  //       depth: 50,
  //       // viewDistance: 25
  //   }
  //   },
  //   title: {
  //     align: 'left',
  //     style : { color : '#787E98', fontWeight : '500', fontFamily : 'roboto', fontSize : '20'},
  //     text: 'AI PREDICTIONS',
  //     x: 8,
  //     y: 4
  //   },
  //   xAxis: {
  //     categories: [
  //       'Data Exfiltration', 'Sharing / <br/>Compromise', 'Malicious / <br/>Spam', 'Privileged<br/>Access Misuse'],
  //     labels : {
  //         step: 1,
  //         width : "20px",
  //       style : { color : '#888EA8'},            
  //     },
  //     gridLineColor: '#888EA8',
  //     lineColor: '#888EA8'
  //   },
  //   yAxis: {
  //     min: 0,
  //     lineWidth: 0,
  //     minorGridLineWidth: 0,
  //     gridLineColor: 'transparent',
  //     lineColor: '#888EA8',
  //     title: {
  //       style : { color : '#fff'},
  //       text: ''
  //     },
  //     labels : {
  //       style : { color : 'transparent'},
  //     }
  //   },
  //   tooltip: {
  //     pointFormat: '{series.name}: <b>{point.y:.0f}</b>'
  //   },
  //   legend: {
  //     verticalAlign: 'top',
  //     itemStyle: {
  //         color: '#E0E0E3',
  //         fontWeight: 'none'
  //     },
  //     itemHoverStyle: {
  //         color: '#FFF'
  //     },
  //     itemHiddenStyle: {
  //         color: '#606063'
  //     }
  // },
  //   plotOptions: {
  //     column: {
  //       stacking: 'normal',
  //      /*  dataLabels: {
  //           enabled: true,
  //       }, */
  //       // pointPadding: 0.2,
  //       borderWidth: 0,

  //   }
  //     // showInLegend: false
  //   },
  //   series: [{
  //     name: 'Users at Risk',
  //     data: [1, 2, 5, null]
  // }, {
  //     name: 'Entities at Risk',
  //     data: [3, 2, 2, 1]
  // }]
  // }

  public aiTrendOption: any = {
    credits: {
      enabled: false
    },
    title: false,
    // {
    //   enabled: false
    //   // align: 'left',
    //   // style: { color: '#787E98', fontWeight: '500', fontFamily: 'roboto', fontSize: '20' },
    //   // text: 'Risk Trend',
    //   // x: 8,
    //   // y: 4
    // },
    yAxis: {
      title: false,
      // {
      //   text: 'Risk Count'
      // },
      gridLineColor: '#888EA8',
      lineColor: '#888EA8',
      labels: {
        style: { color: '#888EA8' },
      }
    },
    xAxis: {
      // accessibility: {
      //   rangeDescription: 'Range: 2010 to 2020'
      // },
      categories: ['Nov 7', 'Nov 19', 'Nov 27', 'Dec 1', 'Dec 14', 'Dec 19'],
      gridLineColor: '#888EA8',
      lineColor: '#888EA8',
      title: {
        style: { color: '#fff' },
        text: ''
      },
      labels: {
        style: { color: '#888EA8' },
      }
    },
    chart: {
      backgroundColor: '#0D1726',
      height: 338,
      spacingBottom: 30,
      spacingTop: 30,
      spacingLeft: 30,
      spacingRight: 30,
    },
    legend: {
      enabled: false
      // layout: 'vertical',
      // align: 'right',
      // // verticalAlign: 'middle'
      // verticalAlign: 'top',
      // itemStyle: {
      //   color: '#E0E0E3',
      //   fontWeight: 'none'
      // },
      // itemHoverStyle: {
      //   color: '#FFF'
      // },
      // itemHiddenStyle: {
      //   color: '#606063'
      // }
    },
    plotOptions: {
      column: {
        // stacking: 'normal',
        borderWidth: 0,
      }
      // series: {
      //   label: {
      //     connectorAllowed: false
      //   },
      //   pointStart: 2010
      // }
    },
    series: [{
      name: 'Risk',
      data: [19, 47, 8, 92, 11, 197]
    }],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  };

  // public aiTrendOption:any = {
  //   credits : {
  //     enabled : false
  // },
  // colors: ['#06ad4e', '#313a4a'],
  // chart: {
  //     backgroundColor: '#0D1726',
  //     type: 'column',
  //   },
  //   title: {
  //     align: 'left',
  //     style : { color : '#787E98', fontWeight : '500', fontFamily : 'roboto', fontSize : '20'},
  //     text: 'AI PREDICTION TREND',
  //     x: 8,
  //     y: 4
  //   },
  //   xAxis: {
  //     categories: ['10 Dec', '11 Dec'],
  //     labels : {
  //         step: 1,
  //         width : "20px",
  //       style : { color : '#888EA8'},            
  //     },
  //     gridLineColor: '#888EA8',
  //     lineColor: '#888EA8'
  //   },
  //   yAxis: {
  //     min: 0,
  //     lineWidth: 0,
  //     minorGridLineWidth: 0,
  //     gridLineColor: 'transparent',
  //     lineColor: '#888EA8',
  //     title: {
  //       style : { color : '#fff'},
  //       text: ''
  //     },
  //     labels : {
  //       style : { color : 'transparent'},
  //     }
  //   },
  //   tooltip: {
  //     pointFormat: '{series.name}: <b>{point.y:1f}</b>'
  //   },
  //   legend: {
  //     verticalAlign: 'top',
  //     itemStyle: {
  //         color: '#E0E0E3',
  //         fontWeight: 'none'
  //     },
  //     itemHoverStyle: {
  //         color: '#FFF'
  //     },
  //     itemHiddenStyle: {
  //         color: '#606063'
  //     }
  // },
  //   plotOptions: {
  //     column: {
  //       stacking: 'normal',
  //       borderWidth: 0,
  //   }
  //     // showInLegend: false
  //   },
  //   series: [{
  //     showInLegend: false,
  //     name: 'Count',
  //     data: [{ y: 13, color: '#2b908f'},
  //     { y: 19, color: '#90ee7e' }]

  // }]
  // } 

  public aiChartOption: any = {
    credits: {
      enabled: false
    },
    colors: ['#06ad4e', '#313a4a'],
    chart: {
      backgroundColor: '#0D1726',
      type: 'column',
    },
    title: false,
    //  {
    //   align: 'left',
    //   style: { color: '#787E98', fontWeight: '500', fontFamily: 'roboto', fontSize: '20' },
    //   text: 'Top Triggered Model Patterns',
    //   x: 8,
    //   y: 4
    // },
    xAxis: {
      categories: ['172,173', '112,116', '112,120,192'],
      labels: {
        step: 1,
        width: "20px",
        style: { color: '#888EA8' },
      },
      gridLineColor: '#888EA8',
      lineColor: '#888EA8'
    },
    yAxis: {
      min: 0,
      lineWidth: 0,
      minorGridLineWidth: 1,
      gridLineColor: '#888EA8',
      lineColor: '#888EA8',
      title: {
        style: { color: '#fff' },
        text: ''
      },
      labels: {
        style: { color: '#888EA8' },
      }
    },
    tooltip: {
      pointFormat: '{series.rule}: <b>{point.rName}</b> <br>{series.target}: <b>{point.tName}</b> <br>{series.name}: <b>{point.y:1f}</b>'
    },
    legend: {
      verticalAlign: 'top',
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
        stacking: 'normal',
        borderWidth: 0,
      }
      // showInLegend: false
    },
    series: [{
      showInLegend: false,
      name: 'Count',
      data: [{ y: 42, color: '#deb03b' },
      { y: 26, color: '#deb03b' },
      { y: 19, color: '#deb03b' }]

    }]
  }

  public aiPredictionOption: any = {
    credits: {
      enabled: false
    },
    colors: ['#06ad4e', '#313a4a'],
    chart: {
      backgroundColor: '#0D1726',
      type: 'column',
    },
    title: false,
    //  {
    //   align: 'left',
    //   style: { color: '#007ad9', fontWeight: '500', fontFamily: 'roboto', fontSize: '20', textTransform: 'uppercase' },
    //   text: 'Top AI-Predictions',
    //   x: 8,
    //   y: 4
    // },
    xAxis: {
      categories: ['172,173->182', '112->116', '114->119'],
      labels: {
        step: 1,
        width: '20px  ' ,
        style: { color: '#888EA8' },
      },
      gridLineColor: '#888EA8',
      lineColor: '#888EA8'
    },
    yAxis: {
      min: 0,
      lineWidth: 0,
      minorGridLineWidth: 1,
      gridLineColor: '#888EA8',
      lineColor: '#888EA8',
      title: {
        style: { color: '#fff' },
        text: ''
      },
      labels: {
        style: { color: '#888EA8' },
      }
    },
    tooltip: {
      // pointFormat: '{series.name}: <b>{point.y:1f}</b>',
      formatter: function () {
        var tooltip = this.series.name + ': <b>' + this.point.y + '</b>';
        tooltip += '<br>' + this.series.name + ' Model: <b>' + this.series.options.desc[this.point.x] + '</b>';
        return tooltip;
      }
    },
    plotOptions: {
      column: {
        // stacking: 'normal',
        borderWidth: 0,
      }
      // showInLegend: false
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      // x: -50,
      // y: 22,
      // x: -100,
      y: 25,
      floating: true,
      borderWidth: 0,
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
      name: 'Triggered',
      data: [{ y: 1, color: '#2b908f', },
      { y: 1, color: '#2b908f', },
      { y: 1, color: '#2b908f', }
      ],
      desc: [],
      color: '#2b908f'
    },
    {
      name: 'Predicted',
      data: [{ y: 0.8, color: '#90ee7e', },
      { y: 0.72, color: '#90ee7e', },
      { y: 0.61, color: '#90ee7e', }
      ],
      desc: [],
      color: '#90ee7e'
    }
    ]
  }
  isLoading: boolean;
  noTopAIPredictions: boolean;
  topAIPredictions = [];
  topAIPredictionsRuleNames = [];
  topAIPredictionsRuleId = [];
  topAITriggered = [];
  topAIPredictionsTargetName = [];

  constructor(private dashboardService: DashboardService) {
    this.isLoading = true;
    this.dashboardService.getDashboardCounts().subscribe((res: any) => {
      this.updateData(res);
      this.isLoading = false;
    });
  }

  ngOnInit() {
    this.initializeTopAiPredictions();
    this.initializeRiskTrend();
    Highcharts.chart('aichart', this.aiChartOption);
    Highcharts.chart('aiTrend', this.aiTrendOption);
  }

  kibanaRedirection() {
    const kibanaRedirectionLink = `${environment.kibanaLink}/app/kibana#/discover?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-3y,to:now))`;
    window.open(kibanaRedirectionLink);
  }

  initializeTopAiPredictions() {
    this.dashboardService.getAiPredictions(0, 5).subscribe((res: any) => {
      // console.log(res)
      if (res && res.length > 0) {
        res.forEach(aiPredictions => {

          // console.log(aiPredictions);
          // + ' -> '
          this.topAIPredictionsRuleId.push(aiPredictions.cause + '  ' + aiPredictions.target);
          this.topAIPredictionsRuleNames.push(aiPredictions.causeRuleNames);
          this.topAIPredictionsTargetName.push(aiPredictions.targetruleName);
          this.topAIPredictions.push({ 'y': aiPredictions.probability });
          this.topAITriggered.push({ 'y': 1 });
        });
        this.aiPredictionOption.xAxis.categories = this.topAIPredictionsRuleId;
        this.aiPredictionOption.series[0].desc = this.topAIPredictionsRuleNames;
        this.aiPredictionOption.series[1].desc = this.topAIPredictionsTargetName;
        this.aiPredictionOption.series[0].data = this.topAITriggered;
        this.aiPredictionOption.series[1].data = this.topAIPredictions;
        Highcharts.chart('aiPrediction', this.aiPredictionOption)
      } else {
        this.noTopAIPredictions = true;
      }
    });
  }

  initializeRiskTrend() {
    this.dashboardService.getRiskTrend(6).subscribe((res: any) => {
      console.log(res)
      /* if (res && res.length > 0) {
        res.forEach(aiPredictions => {

          // console.log(aiPredictions);
          // + ' -> '
          this.topAIPredictionsRuleId.push(aiPredictions.cause + '  ' + aiPredictions.target);
          this.topAIPredictionsRuleNames.push(aiPredictions.causeRuleNames);
          this.topAIPredictionsTargetName.push(aiPredictions.targetruleName);
          this.topAIPredictions.push({ 'y': aiPredictions.probability });
          this.topAITriggered.push({ 'y': 1 });
        });
        this.aiPredictionOption.xAxis.categories = this.topAIPredictionsRuleId;
        this.aiPredictionOption.series[0].desc = this.topAIPredictionsRuleNames;
        this.aiPredictionOption.series[1].desc = this.topAIPredictionsTargetName;
        this.aiPredictionOption.series[0].data = this.topAITriggered;
        this.aiPredictionOption.series[1].data = this.topAIPredictions;
        Highcharts.chart('aiPrediction', this.aiPredictionOption)
      } else {
        this.noTopAIPredictions = true;
      } */
    });
  }


  updateData(data) {
    this.ingestedData.events = intToString(data.eventImported);
    this.ingestedData.users = intToString(data.importedUserCount);
    this.ingestedData.resources = intToString(data.distinctDatasourceCount);
    this.ingestedData.entitlements = intToString(data.distinctEntitlementsCount);
    this.ingestedData.srcIP = intToString(data.importedIpAddressCount);
    this.ingestedData.hosts = intToString(data.importedHostCount);
    this.ingestedData.url = intToString(data.importedUrlCount);

    this.riskyData.riskyUsers = intToString(data.highRiskUserCount);
    this.riskyData.alert = intToString(data.alertsCount);
    this.riskyData.riskyHostname = intToString(data.highRiskHostnameCount);
    this.riskyData.riskySrcIP = intToString(data.highRiskIPCount);
    this.riskyData.oIncAuto = intToString(data.openAutoIncidentsCount);
    this.riskyData.oIncManual = intToString(data.openManualIncidentsCount);
    this.riskyData.remdAuto = 0;
    this.riskyData.remdManual = 0;
    this.riskyData.trtCatMitre = intToString(data.distinctMitreMappingCount);
    this.riskyData.trtCatNist = intToString(data.distinctNistMappingCount);

    this.incidentResponder.enabledModels = intToString(data.enabledModelsCount);
    this.incidentResponder.triggeredModels = intToString(data.distinctTriggeredModelsCount);
    this.incidentResponder.highConfidenceTriggeredModels = intToString(data.highConfidenceTriggeredModelsCount);
    this.incidentResponder.lowConfidenceTriggeredModels = intToString(data.lowConfidenceTriggeredModelsCount);
    this.incidentResponder.closedIncidents = intToString(data.totalClosedIncidentsCount);
    this.incidentResponder.highConfidence = intToString(data.enabledHighConfidenceModelsCount);
    this.incidentResponder.lowConfidence = intToString(data.enabledLowConfidenceModelsCount);
    this.incidentResponder.truePositive = intToString(data.totalTruePositivesCount);
    this.incidentResponder.falsePositive = intToString(data.totalFalsePositivesCount);
    this.incidentResponder.wrongDetection = intToString(data.totalWrongDetectionsCount);
  }
}
