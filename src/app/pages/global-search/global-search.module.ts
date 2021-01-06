import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntitiesComponent } from './entities/entities.component';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { EntitiesService } from './entities/entities.service';
import { MaterialModule } from './../../material';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatSnackBarModule, MatChipsModule } from '@angular/material';
import { CalendarModule, DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DataOpsComponent } from '../data-ops/data-ops.component';
import { InsightsComponent } from '../insights/insights.component';
import { Identity360Component } from '../identity360/identity360.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    HttpClientModule,
    MaterialModule,
    TranslateModule,
    BrowserAnimationsModule,
    NgbModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    DateRangePickerModule,
    RouterModule
  ],
  declarations: [ EntitiesComponent,
    DataOpsComponent,
    InsightsComponent,
    Identity360Component],
  providers: [EntitiesService]
})
export class GlobalSearchModule { }
