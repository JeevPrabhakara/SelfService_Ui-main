import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ActionInsightConfigurationComponent } from './action-insight-configuration/action-insight-configuration.component';
import { InsightConfigurationListComponent } from './insight-configuration-list/insight-configuration-list.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InsightConfigureService } from './insight-configuration.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InsightConfigListComponent } from './insight-config-list/insight-config-list.component';
import { TableModule } from 'primeng/table';
import { MatChipsModule, MatProgressSpinnerModule, MatSnackBarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule, AgGridModule.withComponents([]), FormsModule, ReactiveFormsModule, NgbModalModule.forRoot(),
    AngularMultiSelectModule, BrowserAnimationsModule,
    MatButtonToggleModule, NgbModule, TableModule, MatProgressSpinnerModule, MatSnackBarModule, MatChipsModule
  ],
  declarations: [InsightConfigurationListComponent, ActionInsightConfigurationComponent, InsightConfigListComponent],
  providers: [InsightConfigureService]
})
export class InsightConfigurationModule { }
