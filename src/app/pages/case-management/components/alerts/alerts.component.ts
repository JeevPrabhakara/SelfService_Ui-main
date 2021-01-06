import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  // styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  alertData: any;
  rowGroupMetadata: any;
  critical = 5;
  high = 2;
  medium = 4;
  low = 7;
  constructor() { }

  ngOnInit() {

    this.alertData = [
      { date: '08/02/2018', alertName: 'Shooping User', entityName: 'GDenis', startTime: '08/02/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },
      { date: '08/02/2018', alertName: 'Multiple Logons by User', entityName: 'CBloyes', startTime: '08/02/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },
      { date: '08/02/2018', alertName: 'Non-Standerd Hours User', entityName: 'GDenis', startTime: '08/02/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },
      { date: '08/02/2018', alertName: 'Shooping User', entityName: 'CBloyes', startTime: '08/02/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },

      { date: '08/03/2018', alertName: 'Shooping User', entityName: 'GDenis', startTime: '08/03/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },
      { date: '08/03/2018', alertName: 'Multiple Logons by User', entityName: 'CBloyes', startTime: '08/03/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },
      { date: '08/03/2018', alertName: 'Non-Standerd Hours User', entityName: 'GDenis', startTime: '08/03/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },
      { date: '08/03/2018', alertName: 'Shooping User', entityName: 'CBloyes', startTime: '08/03/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },

      { date: '08/04/2018', alertName: 'Shooping User', entityName: 'GDenis', startTime: '08/04/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },
      { date: '08/04/2018', alertName: 'Multiple Logons by User', entityName: 'CBloyes', startTime: '08/04/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },
      { date: '08/04/2018', alertName: 'Non-Standerd Hours User', entityName: 'GDenis', startTime: '08/04/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },
      { date: '08/04/2018', alertName: 'Shooping User', entityName: 'CBloyes', startTime: '08/04/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },

      { date: '08/05/2018', alertName: 'Shooping User', entityName: 'GDenis', startTime: '08/05/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },
      { date: '08/05/2018', alertName: 'Multiple Logons by User', entityName: 'CBloyes', startTime: '08/05/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },
      { date: '08/05/2018', alertName: 'Non-Standerd Hours User', entityName: 'GDenis', startTime: '08/05/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },
      { date: '08/05/2018', alertName: 'Shooping User', entityName: 'CBloyes', startTime: '08/05/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },

      { date: '08/06/2018', alertName: 'Shooping User', entityName: 'GDenis', startTime: '08/06/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },
      { date: '08/06/2018', alertName: 'Multiple Logons by User', entityName: 'CBloyes', startTime: '08/06/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },
      { date: '08/06/2018', alertName: 'Non-Standerd Hours User', entityName: 'GDenis', startTime: '08/06/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },
      { date: '08/06/2018', alertName: 'Shooping User', entityName: 'CBloyes', startTime: '08/06/2018 23:00', indicator: 2, status: 'Unreviewd', feedback: 'No Feedback' },

    ];
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.alertData) {
      for (let i = 0; i < this.alertData.length; i++) {
        let rowData = this.alertData[i];
        let date = rowData.date;
        if (i == 0) {
          this.rowGroupMetadata[date] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.alertData[i - 1];
          let previousRowGroup = previousRowData.date;
          if (date === previousRowGroup)
            this.rowGroupMetadata[date].size++;
          else
            this.rowGroupMetadata[date] = { index: i, size: 1 };
        }
      }
    }
  }


}
