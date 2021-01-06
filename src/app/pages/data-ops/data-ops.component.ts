import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common'
import { Table } from 'primeng/table';
import { TableModule } from 'primeng/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataOpsService } from './data-ops.service';
import { intToString } from '../../shared/utils/util-functions';

@Component({
  selector: 'app-data-ops',
  templateUrl: './data-ops.component.html',
  styleUrls: ['./data-ops.component.scss']
})
export class DataOpsComponent implements OnInit {


  @ViewChild('dataops') dataops: Table;
  // activeOption: String = 'Users';
  selectedItems: any;
  activeOption: DevOpsOptions = {label: 'Users', value: 'USER'  };
  toggleOptions: DevOpsOptions[] = [{label: 'Users', value: 'USER'  }]
  isLoading: boolean = false;
  // toggleOptions: Array<String> = ['Users', 'Host', 'IP Address', 'File', 'URL'];
  dataOps: any = [];
  cols: any[];
  filterFields: any[];
  // intToString:any = intToString(2);
  intToString = intToString;
  constructor(private dataOpsService: DataOpsService) { }
  
  dataOpsColMap: any[] =  [
    { field: 'resource', header: 'Resource' },
    { field: 'trendColor', header: 'Latest Trend' },
    { field: 'totalCount', header: 'Total Count' },
    { field: 'startDate', header: 'Start Date' },
    { field: 'latestDate', header: 'End Date' },
    { field: 'latest24HCount', header: 'Latest 24H Count' },
    { field: 'attributeCount', header: 'Attribute' }
    ];
   
    optionEntityMap = {
      'USER': this.dataOpsColMap,
  };

  ngOnInit() {
    this.getAllDataOpsData();
    this.cols = this.optionEntityMap[this.activeOption.value];
    this.filterFields = this.cols.map(x => x.field);
  }

  onRefresh(){
    this.ngOnInit();
  }

  getAllDataOpsData(){
    this.isLoading = true;
    this.dataOpsService.getAllDataOps().subscribe(res => {
      this.dataOps = res;
      this.isLoading = false;
    });
  }



}
export interface DevOpsOptions {
  label: string;
  value: string;
}