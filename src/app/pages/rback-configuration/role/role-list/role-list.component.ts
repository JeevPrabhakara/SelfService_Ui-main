import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { ConfirmationModalComponent } from '../../../../shared/confirmation-modal/confirmation-modal.component';
import { AgCellRendererEvent } from '../../../../shared/renderers/ag-cell-rendere.event';
import { dateComparator, filterAgGridDates } from '../../../../shared/ag-grid-date-filters/date-filters';
import { CrudActionComponent } from '../../../../shared/renderers/crud-action/crud-action.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { of, Observable } from 'rxjs';
import { RoleService } from '../role-service';
import { environment } from '../../../../../environments/environment';
import { MatSnackBar } from '@angular/material';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  userPermissions = [];
  userRoles = [];

  //ag grid 
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  columnDefs;
  context;
  frameworkComponents;
  getRowHeight;
  roleList: Observable<any[]> = of([]);

  selectedRoleIds: number[] = [];

  // Ag-Grid Global Filtering PC-PolicyConfiguration
  globalSearchRoleKey = '';
  globalSearchRole() {
    this.gridApi.setQuickFilter(this.globalSearchRoleKey);
  }

  constructor(private ngbModal: NgbModal, private router: Router, private activateRoute: ActivatedRoute,
    private ngZone: NgZone, private roleService: RoleService, private _snackBar: MatSnackBar,
    @Inject(SESSION_STORAGE) private sessionStorage: StorageService) {

    window.scrollTo(0, 0);
    this.userPermissions = JSON.parse(this.sessionStorage.get('userPermissions'));
    this.userRoles = JSON.parse(this.sessionStorage.get('userRoles'));

    this.context = {
      componentParent: this,
      viewButton: this.userRoles.includes('ROLE_ADMIN') && this.userPermissions.includes('View_Profile'),
      editButton: this.userRoles.includes('ROLE_ADMIN') && this.userPermissions.includes('Edit_Profile'),
      deleteButton: this.userRoles.includes('ROLE_ADMIN') && this.userPermissions.includes('Delete_Profile'),
      copyButton: false,
      changePasswordButton: false,
      rowData: 'RoleMaster'
    }

    this.frameworkComponents = {
      crudActionRenderer: CrudActionComponent
    }

    this.initGrid();
  }

  ngOnInit() {
    this.roleService.getAllRoleMasters().subscribe((res: any) => {
      this.roleList = of(res);
    });
  }

  initGrid() {
    this.columnDefs = [{
      headerName: 'Role Name',
      field: 'roleName',
      /* headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true, */
      /* cellRenderer: "agGroupCellRenderer",
      cellRendererParams: { checkbox: true }, */
      sortable: true,  // by default false
      resizable: true,  // by default false
      filter: 'agTextColumnFilter',
      suppressMenu: true,   // filter condition in the header
      floatingFilterComponentParams: { suppressFilterButton: true },  // filter symbol remove
      cellStyle: () => ({ color: '#099bb5' })
    },
    {
      headerName: 'Role Display Name',
      field: 'displayRoleName',
      sortable: true,  // by default false
      resizable: true,  // by default false
      filter: 'agTextColumnFilter',
      suppressMenu: true,   // filter condition in the header
      floatingFilterComponentParams: { suppressFilterButton: true },  // filter symbol remove
    },
    {
      headerName: 'Created By',
      field: 'createdBy',
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    {
      headerName: 'Created On',
      field: 'createdDate',
      sortable: true,
      resizable: false,
      comparator: dateComparator,
      filter: "agDateColumnFilter",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      filterParams: {
        comparator: filterAgGridDates
      }
    },
    {
      headerName: 'Action',
      cellRenderer: 'crudActionRenderer'
    }
    ];
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.hideOverlay();

    params.api.sizeColumnsToFit();
    this.gridColumnApi.autoSizeColumn('Action');
    // this.gridColumnApi.autoSizeColumns(['Action']);
  }

  handleAgRendererEvent(event: AgCellRendererEvent) {
    const data = event.params.data;
    const roleId = data.roleId;

    switch (event.type) {
      case AgCellRendererEvent.VIEW_EVENT:
        this.viewRole(roleId);
        break;
      case AgCellRendererEvent.EDIT_EVENT:
        this.editRole(roleId);
        break;
      case AgCellRendererEvent.DELETE_EVENT:
        this.deleteRole(data.roleId);
        break;
    }
  }

  //  (rowSelected)="onRowSelected()"
  onRowSelected() {
    this.ngZone.run(() => {
      this.selectedRoleIds = [];
      const selectedRoles: any[] = this.gridApi.getSelectedRows();

      for (let i = 0; i < selectedRoles.length; i++)
        this.selectedRoleIds.push(selectedRoles[i].roleId);
    });
  }


  addRole() {
    this.ngZone.run(() => {
      this.router.navigate(['../addRole'], { relativeTo: this.activateRoute });
    });
  }

  editRole(roleId: number) {
    this.ngZone.run(() => {
      this.router.navigate(['../editRole', roleId], { relativeTo: this.activateRoute });
    });
  }

  viewRole(roleId: number) {
    this.ngZone.run(() => {
      this.router.navigate(['../viewRole', roleId], { relativeTo: this.activateRoute });
    });
  }

  deleteRole(roleId: number) {
    const activeModal = this.ngbModal.open(ConfirmationModalComponent, { size: 'sm' });
    activeModal.componentInstance.message = 'Are you sure you want to delete?';
    activeModal.result.then(res => {
      if (res == 'Y') {
        this.roleService.deleteRoleMasterByRoleMasterId(roleId).subscribe(res => {
          this._snackBar.open('Role Deleted Successfully', null, {
            duration: 4000,
          });
          this.ngOnInit();
        })
      }
    });
  }

}
