import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-modal-util',
    templateUrl: './modal.util.component.html',
    styleUrls: ['./modal.util.component.scss']
})
export class ModalUtilComponent implements OnInit {

    modalHeader = '';
    modalMessage = '';
    cancelFlag = true;
    okFlag = true;

    constructor(public activeModal: NgbActiveModal) {
    }

    ngOnInit() {
    }

    closeModal() {
        this.activeModal.dismiss();
    }
}