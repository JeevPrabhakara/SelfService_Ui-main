//import { ICellRendererParams } from 'ag-grid-community';
import { AgCellRendererBase } from './ag-cell-renderer-base';
import { ICellRendererParams } from 'ag-grid-community';

export interface AgCellRendererEvent {
    type: string;
    params: ICellRendererParams;
}

export namespace AgCellRendererEvent {
    export const VIEW_EVENT = 'VIEW_EVENT';
    export const EDIT_EVENT = 'EDIT_EVENT';
    export const DELETE_EVENT = 'DELETE_EVENT';
    export const COPY_EVENT = 'COPY_EVENT';
    export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
}

export interface AgCellRendererEventHandler {
    context: { componentParent: AgCellRendererEventHandler };
    frameworkComponents: { [key: string]: AgCellRendererBase };
    handleAgRendererEvent(event: AgCellRendererEvent): void;
}
