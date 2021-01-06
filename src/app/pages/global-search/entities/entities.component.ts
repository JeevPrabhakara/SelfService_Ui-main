import { Component, OnInit, ViewChild, OnDestroy, forwardRef, Input } from '@angular/core';
import { Table } from 'primeng/table';
import { TableModule } from 'primeng/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EntitiesService } from './entities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import * as Highcharts from 'highcharts';
import { DashboardService } from '../../dashboard/dashboard.service';


export interface ButtonToggle {
  value: string;
  label: string;
}

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, multi: true,
      useExisting: forwardRef(() => EntitiesComponent),
    }
  ]
})
export class EntitiesComponent implements OnInit, OnDestroy {

  @Input() public toggles: ButtonToggle[];

  public value: string;
  public disabled: boolean;

 
 @ViewChild('entity') entity: Table;
  selectedItems: any;
  isLoading: boolean = false;
  riskScore: any = 0;
  isRiskyCheck: boolean = false;
  entityType: any;
  allEntitySubscriber: any;
  entities: any[] = [];
  totalRows: number = 0;
  rowSize: number = 10;
  cols: any[];
  isFiltered: boolean = false;
  filterFields: any[];
  userEntityColMap: any[] = [
    // { field: 'name', header: 'NAME' },
    { field: 'empId', header: 'EMP ID' },
    { field: 'riskScore', header: 'RISK SCORE' },
    { field: 'email', header: 'EMAIL' },
    { field: 'department', header: 'DEPARTMENT' },
    { field: 'title', header: 'TITLE' },
    // { field: 'status', header: 'STATUS' },
    { field: 'city', header: 'CITY' },
    { field: 'startDate', header: 'START DATE' },
    // { field: 'manager', header: 'MANAGER' },
    // { field: 'lastSeenOn', header: 'LAST ACTIVITY SEEN ON ' },
    { field: 'userType', header: 'USER TYPE' }
  ];

  hostEntityColMap: any[] = [
    { field: 'name', header: 'NAME' },
    { field: 'riskScore', header: 'RISK SCORE' },
    { field: 'firstSeenAt', header: 'FIRST SEEN AT ' },
    { field: 'lastSeenAt', header: 'LAST SEEN AT ' },
    { field: 'location', header: 'LOCATION' }
  ];
  ipEntityColMap: any[] = [
    { field: 'name', header: 'NAME' },
    { field: 'riskScore', header: 'RISK SCORE' },
    { field: 'firstSeenAt', header: 'FIRST SEEN AT ' },
    { field: 'lastSeenAt', header: 'LAST SEEN AT ' },
    { field: 'location', header: 'LOCATION' }
  ];
  urlEntityColMap: any[] = [
    { field: 'url', header: 'URL' },
    { field: 'riskScore', header: 'RISK SCORE' },
    { field: 'firstSeenAt', header: 'FIRST SEEN AT ' },
    { field: 'lastSeenAt', header: 'LAST SEEN AT ' },
    { field: 'location', header: 'LOCATION' }
  ];
  optionEntityMap = {
    'HOST': this.hostEntityColMap,
    'IP': this.ipEntityColMap,
    'USER': this.userEntityColMap,
    'URL': this.urlEntityColMap
  };
  noRiskByDept: boolean = false;
  filterByDepartments: any = [];
  chartHide: any;
  filteredDept: any;
  filteredTitle: any;

    public entityChartOption: any = {
    credits: {
        enabled: false
    },
    colors: ['#05A9A9', '#FA9507', '#03ABE7', '#FC368C','#9038FD', '#90ee7e',
    '#2b908f',  '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
        '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
    chart: {
        // backgroundColor: '#0D1726',
        backgroundColor: 'transparent',
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        spacingBottom: -30,
        // spacingTop: 10,
        // spacingLeft: 10,
        // spacingRight: 10,
        // type: 'pie',
        height: 150
    },
    title: {
      text: 'DEPARTMENT',
      align: 'center',
      verticalAlign: 'middle',
      y: 60,
      style: {
        color: 'white'
      }
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  accessibility: {
      point: {
          valueSuffix: '%'
      }
  },
  plotOptions: {
      pie: {
        dataLabels: {
            enabled: true,
            cursor: 'pointer',
            distance: 5,
            style: {
                // fontWeight: 'bold',
                color: 'white'
            }
        },
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '75%'],
        size: '150%',
        borderColor: 'transparent'
      },
      series: {
        cursor: 'pointer',
        point: {
            events: {
                click:
                /* function () {
                  location.href = this.options.url;
                  window.location.reload(); 
                } */
                (function (e) {
                  const p = e.point;
                  this.getFilteredEntities('filterDept', p.name, 0, this.rowSize);
                  this.cols = this.optionEntityMap['USER'];
                  this.isRiskyCheck = true;
                  this.filterFields = this.cols.map(x => x.field);
                }).bind(this) 
            }
        }
    }
  },
  series: [{
      name: 'Brands',
      type: 'pie',
      colorByPoint: true,
      innerSize: '85%',
      minSize: 180,
      data: [
        {
            name: '', y: 61, sliced: true,
            selected: true
        },
        /* { name: 'Infrastructure', y: 12 },
        { name: 'IT Support', y: 11 },
        { name: 'Quality Testing', y: 5 },
        { name: 'Development', y: 5 },
        { name: 'HR', y: 7 } */
    ]
  }]
};
  chartSubscriber: any;

  constructor(private entitiesService: EntitiesService,
    private _route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService) {
    this.toggles = [{ label: 'Users', value: 'USER' },
    { label: 'Host', value: 'HOST' },
    { label: 'IP Address', value: 'IP' },
    { label: 'URL', value: 'URL' }];
    this.value = 'USER';
    this.riskScore = this._route.snapshot.queryParamMap.get('riskScore') ? this._route.snapshot.queryParamMap.get('riskScore') : 0;
    this.isRiskyCheck = (this.riskScore > 0) ? true : false;
  }

  ngOnInit() {
    // if(this.value == 'USER'){
      // debugger;
      this.isLoading = true;
      this.initializeFilterByDept();
      // Highcharts.chart('entityGraph', this.entityChartOption);
    // }
    let matched = true;
    this.filteredDept = this._route.snapshot.queryParamMap.get('filterDept');
    this.filteredTitle = this._route.snapshot.queryParamMap.get('filterTitle');

    // console.log(filteredDept + '-----------' + filteredTitle);
    // console.log('Value' + this.value);
    // console.log(matched && (filteredDept == null) && (filteredTitle == null));
    // console.log(matched);
    // console.log((filteredTitle == null))

    switch (this._route.snapshot.queryParamMap.get('type')) {
      case 'USER':
        this.value = 'USER';
        break;
      case 'HOST':
        this.value = 'HOST';
        break;
      case 'IP':
        this.value = 'IP';
        break;
      case 'URL':
        this.value = 'URL';
        break;
      default:
        matched = false;
    }

    if (matched && (this.filteredDept == null) && (this.filteredTitle == null)) {
      // console.log('Matched')
      this.getAllEntities(this.value, this.riskScore , 0,  this.rowSize);
      this.cols = this.optionEntityMap[this.value];
      this.filterFields = this.cols.map(x => x.field);
      this.isRiskyCheck = (this.riskScore > 0) ? true : false;
    } else if (this.filteredDept) {
      // console.log('filt Dept')
      this.getFilteredEntities('filterDept', this.filteredDept, 0,  this.rowSize);
      this.cols = this.optionEntityMap['USER'];
      this.isRiskyCheck = true;
      this.filterFields = this.cols.map(x => x.field);
    }    else if (this.filteredTitle) {
      // console.log('filt title');

      this.getFilteredEntities('filterTitle', this.filteredTitle, 0,  this.rowSize);
      this.cols = this.optionEntityMap['USER'];
      this.isRiskyCheck = true;
      this.filterFields = this.cols.map(x => x.field);
    } else {
      // console.log('else condition');
      this.getAllEntities(this.value, this.riskScore, 0,  this.rowSize);
      this.cols = this.optionEntityMap[this.value];
      this.filterFields = this.cols.map(x => x.field);
      this.isRiskyCheck = (this.riskScore > 0) ? true : false;
    }
  }
  public onToggleGroupChange({ value }: MatButtonToggleChange): void {
    this.entity._first = 0;
    this.isFiltered = false;
    this.entityType = value;
    this.getAllEntities(value, this.riskScore, 0,  this.rowSize);
    this.cols = this.optionEntityMap[value];
    this.filterFields = this.cols.map(x => x.field);
  }


  getAllEntities(entity, risk, offset, size) {
    this.isFiltered = false;
    this.entityType = entity;
    this.allEntitySubscriber = this.entitiesService.getAllEntities(entity, risk, offset, size).subscribe((res: any) => {
      this.totalRows = res.totalResponseCount;
      this.entities = res.entityList;
      // console.log(res);
      // console.log('Count' + res.totalResponseCount)
      // totalResponseCount
      // console.log(JSON.stringify(res));
      this.isLoading = false;
      this.initializeFilterByDept();
      this.riskScore = 0;
      this.isRiskyCheck = (risk > 0) ? true : false;
    });
  }

  getFilteredEntities(filterparam, filterValue , offset, size) {
    // this.isLoading = true;
    this.isFiltered = true;
    let filter;
    if (filterparam === 'filterDept') {
      filter = { 'u_departmentName.keyword': filterValue };
    } else if (filterparam === 'filterTitle') { filter = { 'u_title.keyword': filterValue }; }
    this.entitiesService.getFilteredEntities(filter,  offset, size).subscribe((res: any) => {
      this.totalRows = res.totalResponseCount;
      this.entities =  res.entityList;
      // console.log(res);
      this.isLoading = false;
      this.riskScore = 0;
    }
    );
  }
  loadEntityLazy(event) {
    if(this.isFiltered) {
      if (this.filteredDept) {
        // console.log('filt Dept')
        this.getFilteredEntities('filterDept', this.filteredDept, event.first, event.rows);
      } else if (this.filteredTitle) {
        this.getFilteredEntities('filterTitle', this.filteredTitle, event.first, event.rows);
      }
    } else {
      let riskyData = (this.isRiskyCheck) ? '85' : '0';
      this.getAllEntities(this.entityType, riskyData, event.first, event.rows);
    }
  }

  initializeFilterByDept() {
    if (this.entityType == 'USER') {
      this.chartSubscriber = this.dashboardService.getRiskCountByDepartment().subscribe((res: any) => {
        //console.log(res);
        this.filterByDepartments = [];
        if (res && res.length > 0) {
          res.forEach(filterByDept => {
            this.filterByDepartments.push({ 'name': filterByDept.departName, 'y': filterByDept.riskScoreCount, 'url': '/#/global-search/entities?filterDept=' + filterByDept.departName });
          });
          this.entityChartOption.series[0].data = this.filterByDepartments;
          Highcharts.chart('entityGraph', this.entityChartOption);
        } else {
          this.noRiskByDept = true;
        }
      });
    }
}

  ngOnDestroy(): void {
    if (this.allEntitySubscriber) {
      this.allEntitySubscriber.unsubscribe();
    }
    if(this.chartSubscriber) {
      this.chartSubscriber.unsubscribe();
    }
  }
}
export interface EntityOptions {
  label: string;
  value: string;
}
