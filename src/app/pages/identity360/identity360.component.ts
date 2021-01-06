import { Component, OnInit, ViewChild, forwardRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { IdentityService } from './identity.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
@Component({
  selector: 'app-identity360',
  templateUrl: './identity360.component.html',
  styleUrls: ['./identity360.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, multi: true,
      useExisting: forwardRef(() => Identity360Component),
    }
  ]
})
export class Identity360Component implements OnInit {


  @Input() public toggleOptions: IdentityOptions[];
  @ViewChild('identity') identity: Table;
  // activeOption: String = 'User Types';
  selectedItems: any;
  selectedIdentity: string;
  totalRows: number = 0;
  rowSize: number = 10;

  isLoading: boolean = false;
  riskScore: any = 0;
  isRiskyCheck: boolean = false;
  constructor(private identityService: IdentityService,
    private _route: ActivatedRoute) {
    // debugger;
    // activeOption: IdentityOptions = {label: 'User Types', value: 'USER TYPES'  };
    this.toggleOptions = [{ label: 'User Types', value: 'USER TYPES' },
    { label: 'Entitlements', value: 'ENTITLEMENTS' },
    { label: 'Access Outliers', value: 'ACCESS OUTLIERS' }];

    this.selectedIdentity = 'USER TYPES';
    this.riskScore = this._route.snapshot.queryParamMap.get('riskScore') ? this._route.snapshot.queryParamMap.get('riskScore') : 0;
    this.isRiskyCheck = (this.riskScore > 0) ? true : false;
  }
  identities: any[] = [];

  cols: any[];
  filterFields: any[];


  filterOptions: IdentityOptions[] = [
    { label: 'Service', value: 'Service' },
    { label: 'Privileged', value: 'Privileged' },
    // { label: 'Regular', value: 'Regular' },
    { label: 'Departing', value: 'departing' },
    { label: 'Dormant', value: 'dormant' },
    { label: 'New User', value: 'newuser' },
    { label: 'External', value: 'External' },
    { label: 'Disabled', value: 'disabled' }
  ];
  activeFilter: IdentityOptions = this.filterOptions[0];
  userIdentityColMap: any[] = [
    // { field: 'name', header: 'NAME' },
    { field: 'empId', header: 'EMP ID' },
    { field: 'riskScore', header: 'RISK SCORE' },
    { field: 'name', header: 'Title' },
    // { field: 'email', header: 'EMAIL' },
    { field: 'userType', header: 'EMP TYPE' },
    { field: 'department', header: 'DEPARTMENT' }
  ];

  entitlementsIdentityColMap: any[] = [
    { field: 'name', header: 'NAME' },
    { field: 'riskScore', header: 'RISK SCORE' },
    { field: 'firstSeenAt', header: 'FIRST SEEN AT ' },
    { field: 'lastSeenAt', header: 'LAST SEEN AT ' },
    { field: 'location', header: 'LOCATION' }
  ];
  accessIdentityColMap: any[] = [
    { field: 'name', header: 'NAME' },
    { field: 'riskScore', header: 'RISK SCORE' },
    { field: 'firstSeenAt', header: 'FIRST SEEN AT ' },
    { field: 'lastSeenAt', header: 'LAST SEEN AT ' },
    { field: 'location', header: 'LOCATION' }
  ];
  optionIdentityMap = {
    'USER TYPES': this.userIdentityColMap,
    'ENTITLEMENTS': this.entitlementsIdentityColMap,
    'ACCESS OUTLIERS': this.accessIdentityColMap,
  };
  ngOnInit() {
    this.isLoading = true;
    // console.log(this.isRiskyCheck)
    const filteredDept = this._route.snapshot.queryParamMap.get('filterDept');
    const filteredTitle = this._route.snapshot.queryParamMap.get('filterTitle');
    let matched = true;
    switch (this._route.snapshot.queryParamMap.get('type')) {
      case 'USER TYPES':
        this.selectedIdentity = 'USER TYPES';
        break;
      case 'ENTITLEMENTS':
        this.selectedIdentity = 'ENTITLEMENTS';
        break;
      case 'ACCESS OUTLIERS':
        this.selectedIdentity = 'ACCESS OUTLIERS';
        break;
      default:
        matched = false;
    }
    if (matched && !filteredDept && !filteredTitle) {
      // this.getAllEntities(this.selectedIdentity, this.riskScore);
      // this.cols = this.optionIdentityMap[this.selectedIdentity];
      // this.filterFields = this.cols.map(x => x.field);
      // this.isRiskyCheck = (this.riskScore > 0) ? true : false;

    }

    if (this.selectedIdentity == 'USER TYPES') {
      this.getUsersByStatusOrType(this.activeFilter.value, 0, this.rowSize, 0);
      this.cols = this.optionIdentityMap[this.selectedIdentity];
      this.filterFields = this.cols.map(x => x.field);

    }
    // this.getUsersByStatusOrType()


  }

  loadIdentityLazy(event) {

    // let userDataKey = {
    //   'u_employeeType.keyword': 'Regular'
    // }
    // this.identityService.getUsersByStatusOrType(userDataKey, event.first, event.rows, 0).subscribe((res: any) => {
    //   console.log(res);
    //   this.identities = res.entityList;
    //   this.totalRows = res.totalResponseCount;
    // })
    // console.log('LAZY LAOD' + this.activeFilter.value)
    this.getUsersByStatusOrType(this.activeFilter.value, event.first, event.rows, 0);
    // this.cols = this.optionIdentityMap[this.selectedIdentity];
    // this.filterFields = this.cols.map(x => x.field);

  }

  setActiveChip(chip) {
    // console.log(chip)
    this.activeFilter = chip;
    // console.log(chip)
    if (this.selectedIdentity == 'USER TYPES') {
      // this.selectedIdentity = 'USER TYPES';
      this.getUsersByStatusOrType(this.activeFilter.value, 0, this.rowSize, 0);
    }
  }

  changeIdentity({ value }: MatButtonToggleChange) {
    // console.log(value);
    if (value == 'USER TYPES') {
      this.selectedIdentity = 'USER TYPES';
      this.getUsersByStatusOrType(this.activeFilter.value, 0, this.rowSize, 0);
    }
    // this.getAllEntities(value, this.riskScore);
    // this.cols = this.optionIdentityMap[value];
    // this.filterFields = this.cols.map(x => x.field);
  }



  getUsersByStatusOrType(option, offset, size, risk) {
    // console.log(option);
    this.isLoading = true;
    // debugger;
    let userDataKey: any;
    switch (option) {
      case 'disabled':
        userDataKey = {
          'is_employeeActive': false
        }
        break;
      case 'departing':
        userDataKey = {
          'is_departingUser': true
        }
        break;
      case 'newuser':
        userDataKey = {
          'is_newUser': true
        }
        break;
      case 'dormant':
        userDataKey = {
          'is_dormant': true
        }
        break;
      case 'Service':
        userDataKey = {
          'u_employeeType.keyword': 'Service'
        }
        break;
      case 'Regular':
        userDataKey = {
          'u_employeeType.keyword': 'Regular'
        }
        break;
      case 'External':
        userDataKey = {
          'u_employeeType.keyword': 'External'
        }
        break;
      case 'Privileged':
        userDataKey = {
          'u_employeeType.keyword': 'Privileged'
        }
        break;

    }
    this.identityService.getUsersByStatusOrType(userDataKey, offset, size, risk).subscribe((res: any) => {
      console.log(res);
      this.identities = res.entityList;
      this.totalRows = res.totalResponseCount;
      this.isLoading = false;

    })
  }
}
export interface IdentityOptions {
  label: string;
  value: string;
}
