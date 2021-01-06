import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-case-modal',
  templateUrl: './case-modal.component.html',
  styleUrls: ['./case-modal.component.scss']
})
export class CaseModalComponent implements OnInit {

  @Input() name;
  @Input() data;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  onAssignClick() {
  }

  onBlockClick() { }
  
}
