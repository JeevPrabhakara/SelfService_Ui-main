import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseManagementComponent } from './case-management.component';
import { AppRoutingModule } from '../../app.routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { CaseManagementService } from './case-management.service';
import { CaseModalComponent } from './components/case-modal/case-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertsComponent } from './components/alerts/alerts.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PolicyViolationSummaryService } from './components/policy-violation-summary/policy-violation-summary.service';
import { IncidentSummaryService } from './components/incident-summary/incident-summary.service';
import { PolicyViolationDetailViewComponent } from './components/policy-violation-detail-view/policy-violation-detail-view.component';
import { PolicyViolationSummaryComponent } from './components/policy-violation-summary/policy-violation-summary.component';
import { IncidentSummaryComponent } from './components/incident-summary/incident-summary.component';
import { PulseGlobeComponent } from './components/pulse-globe/pulse-globe.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TimeAgoPipe } from 'time-ago-pipe';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MaterialModule } from './../../material';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatChipsModule } from '@angular/material/chips';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TranslateModule,
    NgbModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgScrollbarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    DateRangePickerModule

  ],
  declarations: [
    CaseManagementComponent,
    CaseModalComponent,
    AlertsComponent,
    PolicyViolationDetailViewComponent,
    PolicyViolationSummaryComponent,
    IncidentSummaryComponent,
    PulseGlobeComponent,
    TimeAgoPipe
  ],
  exports: [
    TimeAgoPipe
  ],
  entryComponents: [
    CaseModalComponent
  ],
  providers: [
    CaseManagementService,
    PolicyViolationSummaryService,
    IncidentSummaryService
  ]
})
export class CaseManagementModule { }
