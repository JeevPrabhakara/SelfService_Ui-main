import { Component, OnInit, ViewChild ,forwardRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { intToString } from '../../shared/utils/util-functions';
import { DashboardService } from '../dashboard/dashboard.service';
import { InsightsService } from './insights.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, multi: true,
      useExisting: forwardRef(() => InsightsComponent),
    }
  ]
})
export class InsightsComponent implements OnInit {

  @Input() public toggleOptions: InsightsOptions[];
  @ViewChild('entity') entity: Table;
  // activeOption: String = 'Alerts';
  intToString = intToString;
  selectedItems: any;
 
  filterOptions: InsightsOptions[] = [
    {label: 'All', value: 'All'  },
    {label: 'Last 7 Days', value: 'Last 7 Days'  },
    {label: 'Last 30 Days', value: 'Last 30 Days'  },
    {label: 'Last 1 Year', value: 'Last 1 Year'  }
  ];
  activeFilter: InsightsOptions = this.filterOptions[0]
  isLoading: boolean = false;
  riskScore: any = 0;
  isRiskyCheck: boolean = false;
  InsightsType: any = '';
  userFlagged: any[] = [];
  ipFlagged: any[] = [];
  hostFlagged: any[] = [];
  urlFlagged: any[] = [];
  
  constructor(private insightsService: InsightsService,
      private _route: ActivatedRoute,
      private dashboardService: DashboardService) {
        // debugger;
        // activeOption: InsightsOptions = {label: 'Alerts', value: 'ALERTS'  };
        this.toggleOptions= [
          {label: 'Alerts', value: 'ALERTS'  },
          {label: 'Incidents', value: 'INCIDENTS'  },
          {label: 'Threat Stories', value: 'THREAT STORIES'  },
          {label: 'Predictions', value: 'PREDICTIONS'  },
          {label: 'Remediations', value: 'REMEDIATIONS'  }
        ];
        this.InsightsType = 'ALERTS';
        this.riskScore = this._route.snapshot.queryParamMap.get('riskScore') ? this._route.snapshot.queryParamMap.get('riskScore') : 0;
        this.isRiskyCheck = (this.riskScore > 0) ? true : false;
  }
  entities: any[] = [];

  cols: any[];
  filterFields: any[];
  alertInsightsColMap: any[]  =  [
    {field: 'ruleName', header:'Model Name'},
    {field: 'ruleType', header:'Model Type'},
    {field: 'riskScore', header:'Risk Score'},
    {field: 'confidence', header:'Confidence'},
    {field: 'category', header:'Threat Category'},
    {field: 'violationEntityType', header:'Target Entity'},
    {field: 'mitre_mapping', header:'MITRE Mapping'},
    {field: 'nist_mapping', header:'NIST Mapping'},
    {field: 'distinctRuleCount', header:'Entity Count'},
    ];

    incidentInsightsColMap: any[] =  [
      { field: 'incId', header: 'IncidentID' },
      { field: 'incidentCreatedTime', header:	'Event Date' },
      { field: 'entity', header:	'Entity' },
      { field: 'entityType', header: 'Entity Type' },
      { field: 'incidentType', header:	'Incident Type' },
      { field: 'outcome', header:	'Incident Status' },
      { field: 'ruleIds', header: 'Models' },
      { field: 'ownerUsrName', header:	'Owner' }
    ];
    threatStoriesInsightsColMap: any[]  =  [
          { field: 'threatCategory', header: 'Threat Category' },
          { field: 'rules', header: 'Triggered MODELS' },
          { field: 'userFlagged', header: 'Distinct USER Flagged' },
          { field: 'ipFlagged', header: 'Distinct IP Flagged' },
          { field: 'hostFlagged', header: 'Distinct HOST Flagged' },
          { field: 'urlFlagged', header: 'Distinct URL Flagged' }
          ];
    predictionInsightsColMap: any[] =  [
      { field: 'causeRuleNames', header: 'TRIGGERED MODELS' },
      { field: 'targetruleName', header: 'PREDICTED MODELS' },
      { field: 'probability', header: 'PROBABILITY' }
      ];
    urlInsightsColMap: any[] =  [
  { field: 'url', header: 'URL' },
  { field: 'riskScore', header: 'RISK SCORE' },
  { field: 'firstSeenAt', header: 'FIRST SEEN AT ' },
  { field: 'lastSeenAt', header: 'LAST SEEN AT ' },
  { field: 'location', header: 'LOCATION' }
  ];
 optionInsightsMap = {
    'ALERTS': this.alertInsightsColMap,
    'INCIDENTS': this.incidentInsightsColMap,
    'THREAT STORIES': this.threatStoriesInsightsColMap,
    'PREDICTIONS': this.predictionInsightsColMap,
    'REMEDIATIONS': this.urlInsightsColMap
  };
  ngOnInit() {
    // this.activeChip = this.chips[0];
    // console.log(this.isRiskyCheck)
  let matched = true;
  switch (this._route.snapshot.queryParamMap.get('type')) {
    case 'ALERTS':
      // this.activeOption = this.toggleOptions[0];
      this.InsightsType = 'ALERTS';
      // this.setActiveChip(this.filterOptions[0])
      break;
    case 'INCIDENTS':
      // this.activeOption = this.toggleOptions[1];
      this.InsightsType = 'INCIDENTS';
      // this.setActiveChip(this.filterOptions[0])
      break;
    case 'THREAT STORIES':
      // this.activeOption = this.toggleOptions[2];
      this.InsightsType = 'THREAT STORIES';
      this.setActiveChip(this.filterOptions[0])
      break;
    case 'PREDICTIONS':
      // this.activeOption = this.toggleOptions[3];
      this.InsightsType = 'PREDICTIONS';
      this.setActiveChip(this.filterOptions[0])
      break;
    case 'REMEDIATIONS':
      // this.activeOption = this.toggleOptions[4];
      this.InsightsType = 'REMEDIATIONS';
      this.setActiveChip(this.filterOptions[0])
      break;
    default:
      matched: false;
  }
  /* if(matched){
    this.getAllAlerts(0);
    this.cols = this.optionInsightsMap[this.activeOption.value];
    this.filterFields = this.cols.map(x => x.field);
  } */
  const filteredStatus = this._route.snapshot.queryParamMap.get('filterByStatus');
  const filteredClosedIncidents = this._route.snapshot.queryParamMap.get('filterByClosedStatus');
  const filteredIncidentType = this._route.snapshot.queryParamMap.get('incidentByType');
  const filteredAlertConfidence = this._route.snapshot.queryParamMap.get('confidence');
  const filteredType = this._route.snapshot.queryParamMap.get('type');

    if (matched && (filteredStatus == null) && 
        (filteredType == null) && (filteredClosedIncidents == null) && 
        (filteredIncidentType == null) && (filteredAlertConfidence == null)) {
      this.getAllAlerts(0);
      // this.cols = this.optionInsightsMap[this.activeOption.value];
      this.cols = this.optionInsightsMap[this.InsightsType];

      this.filterFields = this.cols.map(x => x.field);
    } else if (filteredStatus) {
      this.getFilteredIncidentStatus('filterByStatus', filteredStatus);
      // this.cols = this.optionInsightsMap[this.activeOption.value];
      this.cols = this.optionInsightsMap[this.InsightsType];
      this.filterFields = this.cols.map(x => x.field);
    } else if (filteredIncidentType) {
        if(filteredIncidentType === 'Auto'){
          this.getAllIncidentTypeData('Auto');
        } else {
          this.getAllIncidentTypeData('Manual');
        }
        this.cols = this.optionInsightsMap[this.InsightsType];
        this.filterFields = this.cols.map(x => x.field);
    } else if (filteredClosedIncidents) {
      if(filteredClosedIncidents === 'truePositive'){
        // console.log("Incident Type - truePositive");
        this.getFilteredIncidentStatus('filterByClosedStatus', filteredClosedIncidents);
      } else if(filteredClosedIncidents === 'falsePositive'){
        // console.log("Incident Type - falsePositive");
        this.getFilteredIncidentStatus('filterByClosedStatus', filteredClosedIncidents);
      } else if(filteredClosedIncidents === 'wrongDetection'){
        // console.log("Incident Type - wrongDetection");
        this.getFilteredIncidentStatus('filterByClosedStatus', filteredClosedIncidents);
      }
      // this.cols = this.optionInsightsMap[this.activeOption.value];
      this.cols = this.optionInsightsMap[this.InsightsType];
      this.filterFields = this.cols.map(x => x.field);
    } else if (filteredAlertConfidence) {
      if(filteredAlertConfidence === 'High'){
        // console.log("Alert Confidence - High");
        this.getAllAlertsConfidence('High');
      } else if(filteredAlertConfidence === 'Low'){
        // console.log("Alert Confidence - Low");
        this.getAllAlertsConfidence('Low');
      }
      // this.cols = this.optionInsightsMap[this.activeOption.value];
      this.cols = this.optionInsightsMap[this.InsightsType];
      this.filterFields = this.cols.map(x => x.field);
    } else {
      // this.InsightsType = this.activeOption.value;
      this.setActiveChip(this.activeFilter);
      /* this.getAllAlerts(0);
      this.cols = this.optionInsightsMap[this.activeOption.value];
      this.filterFields = this.cols.map(x => x.field); */
    }

}
 
// for last 7d 30d 1y
  setActiveChip(chip) {
    // console.log(chip)
        this.activeFilter = chip;
        if(this.InsightsType == ''){
          this.InsightsType = 'ALERTS';
        }

          // this.getAllAlerts(value, this.riskScore);

        if(this.InsightsType == 'ALERTS'){
          if (chip.value === 'All'){
            this.getAllAlerts(0);
          } else if (chip.value === 'Last 7 Days'){
            this.getAllAlerts(7);
          } else if (chip.value === 'Last 30 Days'){
            this.getAllAlerts(30);
          } else if (chip.value === 'Last 1 Year'){
            this.getAllAlerts(365);
          }
          this.cols = this.optionInsightsMap[this.InsightsType];
          this.filterFields = this.cols.map(x => x.field);
        } else if(this.InsightsType == 'INCIDENTS'){
            if (chip.value === 'All'){
              this.getAllIncidentData();         
            } else if (chip.value === 'Last 7 Days'){
              this.getAllIncidents(5000, 7);         
            } else if (chip.value === 'Last 30 Days'){
              this.getAllIncidents(5000, 30);
            } else if (chip.value === 'Last 1 Year'){
              this.getAllIncidents(5000, 365);
            }
          this.cols = this.optionInsightsMap[this.InsightsType];
          this.filterFields = this.cols.map(x => x.field);
        } else if(this.InsightsType == 'PREDICTIONS'){
            if (chip.value === 'All'){
              this.getAllPredictions();       
            } else if (chip.value === 'Last 7 Days'){
              this.getAllPredictions();      
            } else if (chip.value === 'Last 30 Days'){
              this.getAllPredictions();
            } else if (chip.value === 'Last 1 Year'){
              this.getAllPredictions();
            }
          this.cols = this.optionInsightsMap[this.InsightsType];
          this.filterFields = this.cols.map(x => x.field);
        }
        else if(this.InsightsType == 'THREAT STORIES'){
          if (chip.value === 'All'){
            this.getAllThreatStories();       
          } else if (chip.value === 'Last 7 Days'){
            this.getAllThreatStories();      
          } else if (chip.value === 'Last 30 Days'){
            this.getAllThreatStories();
          } else if (chip.value === 'Last 1 Year'){
            this.getAllThreatStories();
          }
        this.cols = this.optionInsightsMap[this.InsightsType];
        this.filterFields = this.cols.map(x => x.field);
      }
        //else other tabs
    }
// for tabs
changeInsights({ value }: MatButtonToggleChange) {
  // console.log(value)
  // this.getAllAlerts(value, this.riskScore);
  this.InsightsType = value;
  // set default when change tabs
  this.activeFilter = this.filterOptions[1];
  if (value === 'ALERTS'){
    this.getAllAlerts(7);
    this.cols = this.optionInsightsMap[value];
    this.filterFields = this.cols.map(x => x.field);
  } else if (value === 'INCIDENTS'){
    this.getAllIncidents(5000, 7);
    this.cols = this.optionInsightsMap[value];
    this.filterFields = this.cols.map(x => x.field);
  } else if (value === 'PREDICTIONS'){
    this.getAllPredictions();
    this.cols = this.optionInsightsMap[value];
    this.filterFields = this.cols.map(x => x.field);
  }else if (value === 'THREAT STORIES'){
    this.getAllThreatStories();
    this.cols = this.optionInsightsMap[value];
    this.filterFields = this.cols.map(x => x.field);
  } else {
    // alerts
    // this.getAllAlerts();
    this.cols = this.optionInsightsMap[value];
    this.filterFields = this.cols.map(x => x.field);
  }
}


getAllAlerts(previousDates?: number, startDate?: Date, endDate?: Date) {
  if (!endDate)
  var endDate = new Date();
  this.isLoading = true;

  if (!startDate)
    var startDate = new Date();
  // const quaterDate = new Date(date.getMonth() - 3);   -> from 1970 year

  //console.log(previousDates);
  if (previousDates){
    startDate.setDate(startDate.getDate() - previousDates); // goto previous given number of month
    // console.log(startDate);
  }

  const formattedEndDate = (endDate.getUTCMonth() + 1) +
  '-' + (endDate.getUTCDate()) +
  '-' + (endDate.getUTCFullYear()) + " 23:59:59";
  /* ' ' + (endDate.getUTCHours()) +
  ':' + (endDate.getUTCMinutes()) +
  ':' + (endDate.getUTCSeconds()); */
  // console.log("End Date::");
  // console.log(formattedEndDate); //today date
  const formattedStartDate = (startDate.getUTCMonth() + 1) +
  '-' + (startDate.getUTCDate()) +
  '-' + (startDate.getUTCFullYear()) + " 00:00:00";
  /* ' ' + (startDate.getUTCHours()) +
  ':' + (startDate.getUTCMinutes()) +
  ':' + (startDate.getUTCSeconds()); */
  // console.log("Start Date::");
  // console.log(formattedStartDate);

  if(previousDates === 0){
      // to fetch all alerts data
        this.isLoading = true;
        this.insightsService.getAllAlerts(0).subscribe((res:any) => {
          // console.log(res)
        this.entities = res;
        this.isLoading = false;
      });
  } else { 
    var d = new Date(formattedStartDate);
    let ms = d.getTime();
    //console.log(ms);
    this.isLoading = true;
    // this.insightsService.getAllAlerts(entity, risk, 0, 10000).subscribe((res:any) => {
      this.insightsService.getAllAlerts(ms).subscribe((res:any) => {
        this.entities = res;
        this.isLoading = false;
        this.riskScore = 0;
      });
    }
}

getAllAlertsConfidence(value: string){
  this.isLoading = true;
  var alertConfidence = [];
  if(value === 'High'){
    this.insightsService.getAllAlerts(0).subscribe((res:any) => {
      for(let i=0; i<res.length; i++){
        if(res[i].confidence === 'HIGH'){
          alertConfidence.push(res[i]);
          this.entities = alertConfidence;
        }
      }
      this.isLoading = false;
    });
  } else if(value === 'Low'){
    this.insightsService.getAllAlerts(0).subscribe((res:any) => {
      for(let i=0; i<res.length; i++){
        if(res[i].confidence === 'LOW'){
          alertConfidence.push(res[i]);
          this.entities = alertConfidence;
        }
      }
      this.isLoading = false;
    });
  }
}

getAllIncidents(incidentCount: number, previousDates?: number, startDate?: Date, endDate?: Date) {
  if (!endDate)
      var endDate = new Date();
      this.isLoading = true;

  if (!startDate)
      var startDate = new Date();
  // const quaterDate = new Date(date.getMonth() - 3);   -> from 1970 year

  if (previousDates){
    startDate.setDate(startDate.getDate() - previousDates); // goto previous given number of month
    //console.log(previousDates);
    // console.log(startDate);
  }

  const formattedEndDate = endDate.getUTCFullYear() +
      '-' + (endDate.getUTCMonth() + 1) +
      '-' + (endDate.getUTCDate()) + " 23:59:59";
  /* ' ' + (endDate.getUTCHours()) +
  ':' + (endDate.getUTCMinutes()) +
  ':' + (endDate.getUTCSeconds()); */
    //console.log("End Date::");
  //console.log(formattedEndDate); //today date
  const formattedStartDate = startDate.getUTCFullYear() +
  '-' + (startDate.getUTCMonth() + 1) +
  '-' + (startDate.getUTCDate()) + " 00:00:00";
  /* ' ' + (startDate.getUTCHours()) +
  ':' + (startDate.getUTCMinutes()) +
  ':' + (startDate.getUTCSeconds()); */
    //console.log("Start Date::");
  //console.log(formattedStartDate);
  // console.log(encodeURIComponent(formattedEndDate));
  // console.log(encodeURIComponent(formattedStartDate));
  
  this.insightsService.getAllIncidents(0, incidentCount, encodeURIComponent(formattedStartDate), encodeURIComponent(formattedEndDate)).subscribe((response: any) => {

    //console.log(response);
    this.entities = response;
    this.isLoading = false;
  }, error => {
      //console.log('Get Incidents Error..')
  });
}

getAllIncidentData(){
  this.insightsService.getAllIncidentData().subscribe((response: any) => {
    //console.log(response);
    this.entities = response;
    this.isLoading = false;
  }, error => {
      //console.log('Get Incidents Error..')
  });
}

getAllIncidentTypeData(value: string){
  this.insightsService.getAllIncidentData().subscribe((response: any) => {
    //console.log(response);
    var insights = [];
    if(value === 'Auto'){
      for(let i=0; i<=response.length; i++){
        if( response[i].outcome === 'OPEN' && response[i].incidentType === 'AutoIncident'){
          insights.push(response[i]);
          this.entities = insights;
        }
      }
    } else if(value === 'Manual'){
      for(let i=0; i<=response.length; i++){
        if( response[i].outcome === 'OPEN' && response[i].incidentType === 'ManualIncident'){
          insights.push(response[i]);
          this.entities = insights;
        }
      }
    }
    this.isLoading = false;
  }, error => {
      //console.log('Get Incidents Error..')
  });
}

getFilteredEntities(filterparam: string , filterValue: string) {
  this.isLoading = true;
  let filter;
  if(filterparam === 'filterDept') {
    filter =  {'u_departmentName.keyword': filterValue};
   } else if(filterparam === 'filterTitle') { filter =  { 'u_title.keyword': filterValue  };}
   //console.log(filter)
  this.insightsService.getFilteredEntities(filter).subscribe((res: any[]) =>
    {
      this.entities = res;
      // console.log(res);
      this.isLoading = false;
      this.riskScore = 0;
    }
    );

}

checkIsCEP(value: string){
 if(value == 'cep'){
   return 'Rule'
 } else if(value == 'Anomaly'){
  return 'Statistical'
 }

}

getFilteredIncidentStatus(filterparam: string, filterValue: string) {
  this.isLoading = true;
  // let filter;
  if (filterparam === 'filterByStatus') {
    // filter = { 'u_status.keyword': filterValue };

    this.insightsService.getFilteredIncidentStatus().subscribe((res: any[]) => {
      // console.log(res);
      this.entities = res;
      this.isLoading = false;
    });
  } else if(filterparam === 'filterByClosedStatus') {
    var closedStatus = [];
    if(filterValue === 'truePositive'){
      this.insightsService.getFilteredIncidentStatus().subscribe((res: any[]) => {
        for(let i=0; i<res.length; i++){
          if(res[i].outcome === 'TRUE_POSITIVE'){
            closedStatus.push(res[i]);
            this.entities = closedStatus;
          }
        }
        this.isLoading = false;
      });
    } else if(filterValue === 'falsePositive'){
      this.insightsService.getFilteredIncidentStatus().subscribe((res: any[]) => {
        for(let i=0; i<res.length; i++){
          if(res[i].outcome === 'FALSE_POSITIVE_RIGHT_DETECTION'){
            closedStatus.push(res[i]);
            this.entities = closedStatus;
          }
        }
        this.isLoading = false;
      });
    } else if(filterValue === 'wrongDetection'){
      this.insightsService.getFilteredIncidentStatus().subscribe((res: any[]) => {
        for(let i=0; i<res.length; i++){
          if(res[i].outcome === 'FALSE_POSITIVE_WRONG_DETECTION'){
            closedStatus.push(res[i]);
            this.entities = closedStatus;
          }
        }
        this.isLoading = false;
      });
    }
  }
}

getAllPredictions(){
  this.dashboardService.getAiPredictions(0, 5000).subscribe((res: any) => {
    // console.log(res);
    this.entities = res;
    this.isLoading = false;
  });
}

getAllThreatStories(){
  this.isLoading = true;
  this.insightsService.getAllThreatStories(0).subscribe((res: any[]) => {
    console.log(res);
    this.entities = res;
    // violatorType: "USER"
    // violatorTypeCount: 10004
    // violators: (247)
    this.userFlagged = [];
    this.ipFlagged = [];
    this.hostFlagged = [];
    this.urlFlagged = [];
    for(let i=0; i<res.length; i++){
      for(let j=0; j<res[i].violatorTypes.length; j++){
        if(res[i].violatorTypes[j].violatorType === 'USER'){
          this.userFlagged.push(res[i].violatorTypes[j].violators.length);
          if(res[i].violatorTypes.length < 2){
            this.ipFlagged.push(0);
            this.hostFlagged.push(0);
            this.urlFlagged.push(0);
          }
        } else if(res[i].violatorTypes[j].violatorType === 'IP'){
          this.ipFlagged.push(res[i].violatorTypes[j].violators.length);
          if(res[i].violatorTypes.length < 2){
            this.userFlagged.push(0);
            this.hostFlagged.push(0);
            this.urlFlagged.push(0);
          }
        } else if(res[i].violatorTypes[j].violatorType === 'HOST'){
          this.hostFlagged.push(res[i].violatorTypes[j].violators.length);
         if(res[i].violatorTypes.length < 2){
            this.userFlagged.push(0);
            this.ipFlagged.push(0);
            this.urlFlagged.push(0);
          }
        } else if(res[i].violatorTypes[j].violatorType === 'URL'){
          this.urlFlagged.push(res[i].violatorTypes[j].violators.length);
          if(res[i].violatorTypes.length < 2){
            this.userFlagged.push(0);
            this.ipFlagged.push(0);
            this.hostFlagged.push(0);
          }
        } else {
            this.userFlagged.push(0);
            this.ipFlagged.push(0);
            this.hostFlagged.push(0);
            this.urlFlagged.push(0);
        }
      }
    }
    this.isLoading = false;
  });
}

makeNewLine(value: any){
  if(value){
    // convert array to string
    let ruleName = value.toString();
    // replace comma with newline
    let triggeredModel = ruleName.replace(/,/g, '<br>');
    return triggeredModel
  } else {
    return value
  }
}

}
export interface InsightsOptions {
    label: string;
    value: string;
}
