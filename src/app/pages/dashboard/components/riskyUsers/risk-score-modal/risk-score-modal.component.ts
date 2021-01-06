import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-risk-score-modal',
  templateUrl: './risk-score-modal.component.html',
  styleUrls: ['./risk-score-modal.component.scss']
})
export class RiskScoreModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
