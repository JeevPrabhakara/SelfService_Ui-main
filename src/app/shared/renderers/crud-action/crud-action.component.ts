import { Component, OnInit } from '@angular/core';
import { AgCellRendererBase } from '../ag-cell-renderer-base';
import { AgCellRendererEvent } from '../ag-cell-rendere.event';

@Component({
  selector: 'app-crud-action',
  templateUrl: './crud-action.component.html',
  styleUrls: ['./crud-action.component.scss']
})
export class CrudActionComponent extends AgCellRendererBase {

  edit(event: any) {
    this.sendEvent(AgCellRendererEvent.EDIT_EVENT);
  }

  view(event: any) {
    this.sendEvent(AgCellRendererEvent.VIEW_EVENT);
  }

  delete(event: any) {
    this.sendEvent(AgCellRendererEvent.DELETE_EVENT);
  }

  copy(event: any) {
    this.sendEvent(AgCellRendererEvent.COPY_EVENT);
  }

  changePassword(event: any) {
    this.sendEvent(AgCellRendererEvent.CHANGE_PASSWORD);
  }

}
