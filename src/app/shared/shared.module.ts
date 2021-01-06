import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { CrudActionComponent } from './renderers/crud-action/crud-action.component';
import { AgGridModule } from 'ag-grid-angular';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        SharedPipesModule,
        AgGridModule.withComponents([]),
        NgbModalModule.forRoot()
    ],
    declarations: [
        CrudActionComponent,
        ConfirmationModalComponent
    ],
    entryComponents: [CrudActionComponent, ConfirmationModalComponent]
})
export class SharedModule { }
