import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-risky-user-info-modal',
  templateUrl: './risky-user-info-modal.component.html',
  styleUrls: ['./risky-user-info-modal.component.scss']
})
export class RiskyUserInfoModalComponent implements OnInit {

  @Input() userInfo;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
