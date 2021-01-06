import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RiskyUserService } from '../riskyUser.service';
declare var $;

@Component({
  selector: 'app-riskyUsers-modal',
  templateUrl: './riskyUsers-modal.component.html',
  styleUrls: ['./riskyUsers-modal.component.scss']
})
export class ContentModalComponent implements OnInit{

  @ViewChild('rawTable') table: ElementRef;
  dataTable: any;
  selectedView = 'riskScore';
  @Input() ruilId;
  @Input() userId;
  @Input() isotimestamp;

  violationSummary:any = null;
  dtOption:any;
  demoTableData:any;
  constructor(public activeModal: NgbActiveModal, private riskyUserService: RiskyUserService) {

   }

  ngOnInit() {
    // this.demoTableData = this.riskyUserService.getData();
    this.riskyUserService.getViolationSummary(this.ruilId, this.userId, this.isotimestamp).subscribe(val => {
      this.violationSummary = val;
      this.dtOption = 
      {
        "lengthChange": false,
        "pageLength": 5,
        "data":this.violationSummary.data,
        columns: [
          { data: 'userid' },
          { data: 'ruleid' },
          { data: 'riskscore' },
          { data: 'attacktype' }
      ],
      dom: "<'row'<'col-sm-12 col-md-11'f><'col-sm-12 col-md-1'B>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        buttons: [{
          extend: 'excelHtml5',
          title: 'Risky User Info',
          titleAttr: 'Download Risky User Info',
          text:      '<i class="fa fa-download"></i>'
      }]
      }
      this.dataTable = $(this.table.nativeElement);
      this.dataTable.DataTable(this.dtOption);
      });
     
  }

  switchViolationView(view)   {
    this.selectedView = view;
  }
}
