import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InsightConfigureService } from '../insight-configuration.service';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-insight-config-list',
  templateUrl: './insight-config-list.component.html',
  styleUrls: ['./insight-config-list.component.scss']
})
export class InsightConfigListComponent implements OnInit {

  @ViewChild('dt') dt: Table;
  allInsightConfigs: any[];
  selectedInsights = [];
  loading: boolean = true;
  // headers = ['Model ID', 'Model Name', 'Model Type', 'Target Entity', 'Risk Score', 'Dataset', 'Threat Category', 'Status'];
  headers = [
    {field: 'policyId', header: 'Model ID'},
    {field: 'policy_name', header: 'Model Name'},
    {field: 'policy_type', header: 'Model Type'},
    {field: 'entity', header: 'Target Entity'},
    {field: 'risk_score', header: 'Risk Score'},
    {field: 'criticality', header: 'Confidence'},
    {field: 'dataSource', header: 'Dataset'},
    {field: 'category_name', header: 'Threat Category'},
    {field: 'enable', header: 'Status'}
  ];

  filterFields: any[];

  constructor(private service: InsightConfigureService,
     public dialog: MatDialog,
     private _route: ActivatedRoute) { }

  ngOnInit() {
    // this.getAllPolicyConfig();
    
    // filterByStatus
    let matched = true;
    const filteredStatus = this._route.snapshot.queryParamMap.get('filterByStatus');
    const filteredConfidence = this._route.snapshot.queryParamMap.get('confidence');

    if (matched && (filteredStatus == null) && (filteredConfidence == null)) {
      this.getAllPolicyConfig();
      this.filterFields = this.headers.map(x => x.field);
    } else if (filteredStatus) {
      this.getFilteredModelStatus('filterByStatus', filteredStatus);
      this.filterFields = this.headers.map(x => x.field);
    } else if (filteredConfidence) {
      if(filteredConfidence === 'High'){
        // console.log("Alert Confidence - High");
        this.getFilteredModelConfidence('High');
      } else if(filteredConfidence === 'Low'){
        // console.log("Alert Confidence - Low");
        this.getFilteredModelConfidence('Low');
      }
      this.filterFields = this.headers.map(x => x.field);
    } else {
      this.getAllPolicyConfig()
      this.filterFields = this.headers.map(x => x.field);
    }
  }

  getAllPolicyConfig(){
    this.loading = true;
    this.service.getAllPolicyConfig().subscribe(res => {
      console.log(res);
      this.loading = false;
      this.allInsightConfigs = res;
      this.filterFields = this.headers.map(x => x.field);
    });
  }

  getFilteredModelStatus(filterparam: string, filterValue: string) {
    this.loading = true;
    let filter;
    if (filterparam === 'filterByStatus') {
      filter = { 'u_status.keyword': filterValue };
      //console.log(filter)
    }
    this.service.getFilteredModelStatus().subscribe((res: any[]) => {
      // console.log(res);
      this.allInsightConfigs = res;
      this.loading = false;
    }
    );
  }

  getFilteredModelConfidence(value: string){
    this.loading = true;
  var enabledModelConfidence = [];
  if(value === 'High'){
    this.service.getFilteredModelStatus().subscribe((res:any) => {
      for(let i=0; i<res.length; i++){
        if(res[i].criticality === 'HIGH'){
          enabledModelConfidence.push(res[i]);
          this.allInsightConfigs = enabledModelConfidence;
        }
      }
      this.loading = false;
    });
  } else if(value === 'Low'){
    this.service.getFilteredModelStatus().subscribe((res:any) => {
      for(let i=0; i<res.length; i++){
        if(res[i].criticality === 'LOW'){
          enabledModelConfidence.push(res[i]);
          this.allInsightConfigs = enabledModelConfidence;
        }
      }
      if(this.allInsightConfigs === undefined){
        this.allInsightConfigs = [];
      }
      this.loading = false;
    });
  }

  }

  deleteSelectedInsightConfigs() {
    debugger
    const insightIds = this.selectedInsights.map(insight => insight.policyId);
    this.service.deletePolicyConfigs(insightIds).subscribe(res => {
      this.selectedInsights = [];
      this.allInsightConfigs = this.allInsightConfigs.filter(insight => !insightIds.includes(insight.policyId));
    }, error => {
      this.selectedInsights = [];
      this.allInsightConfigs = this.allInsightConfigs.filter(insight => !insightIds.includes(insight.policyId));
    });
  }

  confirmDelete(insightConfig){
    //console.log(insightConfig);
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',

      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      // console.log('The dialog was closed');
      if(result){
        this.deleteInsightConfig(insightConfig)
      }
    });

  }

  deleteInsightConfig(insightConfig) {
    //console.log(insightConfig);
    debugger
    this.service.deletePolicyConfig(insightConfig.policyId + 12324).subscribe(res => {
      //console.log("Deleted");
      this.allInsightConfigs = this.allInsightConfigs.filter(insight => insight.policyId != insightConfig.policyId);
    }, error => {
      //console.log(error);
      //console.log("Error");
      this.allInsightConfigs = this.allInsightConfigs.filter(insight => insight.policyId != insightConfig.policyId);
    });
  }

}
