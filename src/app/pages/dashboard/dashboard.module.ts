import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { EasyPieChartModule } from 'ng2modules-easypiechart';
import { DashboardService } from './dashboard.service';
import { TopDetailsComponent } from './components/topDetails/topDetails.component';
import { TopDetailsService } from './components/topDetails/topDetails.service';
import { RiskyUsersComponent } from './components/riskyUsers/riskyUsers.component';
import { AppRoutingModule } from '../../app.routing.module';
import { RiskyUserService } from './components/riskyUsers/riskyUser.service';
import { ContentModalComponent } from './components/riskyUsers/riskyUsers-modal/riskyUsers-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RiskyUserInfoModalComponent } from './components/riskyUsers/risky-user-info-modal/risky-user-info-modal.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox'
import { RadioButtonModule } from 'primeng/radiobutton';
import { GlobeChartComponent } from './components/globe-chart/globe-chart-component';
import { ChartModule } from 'primeng/chart';
import { AmChartsModule } from "@amcharts/amcharts3-angular";
import { RiskScoreModalComponent } from './components/riskyUsers/risk-score-modal/risk-score-modal.component';
import { FilterRiskEntityComponent } from './components/riskyUsers/filter-risk-entity/filter-risk-entity.component';
import { RiskyEntityViewComponent } from './components/riskyUsers/filter-risk-entity/risky-entity-view/risky-entity-view';
import { MaterialModule } from './../../material';
import { RiskyIPComponent } from './components/risky-ip/risky-ip.component';
import { RiskyHostComponent } from './components/riskyHost/riskyHost.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { DashboardCountComponent } from './components/dashboard-count/dashboard-count.component';
import { TopUsersComponent } from './components/top-users/top-users.component';
import { MatProgressSpinnerModule, MatSnackBarModule, MatChipsModule } from '@angular/material';

@NgModule({
    declarations: [
        DashboardComponent,
        TopDetailsComponent,
        RiskyUsersComponent,
        ContentModalComponent,
        RiskyUserInfoModalComponent,
        GlobeChartComponent,
        RiskScoreModalComponent,
        RiskyEntityViewComponent,
        FilterRiskEntityComponent,
        RiskyIPComponent,
        RiskyHostComponent,
        DashboardCountComponent,
        TopUsersComponent
    ],
    imports: [
        CommonModule,
        AppRoutingModule,
        TranslateModule,
        EasyPieChartModule,
        NgbModule,
        TableModule,
        DropdownModule,
        CheckboxModule,
        RadioButtonModule,
        ChartModule,
        MaterialModule,
        AmChartsModule,
        HighchartsChartModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatChipsModule
    ],
    entryComponents: [
        ContentModalComponent,
        RiskyUserInfoModalComponent,
        RiskScoreModalComponent
    ],
    providers: [
        DashboardService,
        TopDetailsService,
        RiskyUserService
    ],
    exports: [DashboardComponent]
})
export class DashboardModule {
}
