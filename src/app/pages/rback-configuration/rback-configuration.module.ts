import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleListComponent } from './role/role-list/role-list.component';
import { RoleActionComponent } from './role/role-action/role-action.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserActionComponent } from './user/user-action/user-action.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonToggleModule } from '@angular/material';
import { AgGridModule } from 'ag-grid-angular';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { RoleService } from './role/role-service';
import { UserService } from './user/user-service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChangePasswordComponent } from './user/change-password/change-password.component';

@NgModule({
  imports: [
    CommonModule, AgGridModule.withComponents([]), FormsModule, ReactiveFormsModule, NgbModalModule.forRoot(),
    BrowserAnimationsModule, MatButtonToggleModule, NgbModule,
    AngularMultiSelectModule, MatSnackBarModule
  ],
  declarations: [RoleListComponent, RoleActionComponent, UserListComponent, UserActionComponent,
    ChangePasswordComponent],
  providers: [RoleService, UserService],
  entryComponents: [ChangePasswordComponent]
})
export class RbackConfigurationModule { }
