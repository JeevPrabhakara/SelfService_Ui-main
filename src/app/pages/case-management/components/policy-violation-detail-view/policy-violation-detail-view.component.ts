import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-policy-violation-detail-view',
  templateUrl: './policy-violation-detail-view.component.html',
  styleUrls: ['./policy-violation-detail-view.scss']
})
export class PolicyViolationDetailViewComponent implements OnInit {

  dateTitle = 'August 11th 2016, 13:00:00:000 - August 12th 2016, 15:20:30:000';
  chartOpen = true;

  cardObjects = [
    {
      accord: true,
      date: 'August 12th 2016, 13:00:00:000',
      details: [
        { flightNum: 'DDZ6PLZ', destCountry: 'IT', originWeather: 'Venice', avgTicketPrice1: '$120', distanceMiles: '0', avgTicketPrice2: '$120' },
        { flightNum: 'DDZ6PLZ', destCountry: 'IT', originWeather: 'Venice', avgTicketPrice1: '$120', distanceMiles: '0', avgTicketPrice2: '$120' },
        { flightNum: 'DDZ6PLZ', destCountry: 'IT', originWeather: 'Venice', avgTicketPrice1: '$120', distanceMiles: '0', avgTicketPrice2: '$120' },
        { flightNum: 'DDZ6PLZ', destCountry: 'IT', originWeather: 'Venice', avgTicketPrice1: '$120', distanceMiles: '0', avgTicketPrice2: '$120' }
      ],
      accordDetails: [
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: '', value2: '', flightNum2: '', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: '', value2: '', flightNum2: '', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: 'DDZ6PLZ', value2: '9.923', flightNum2: 'DDZ6PLZ', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: '', value2: '', flightNum2: '', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: '', value2: '', flightNum2: '', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: 'DDZ6PLZ', value2: '9.923', flightNum2: 'DDZ6PLZ', day: 'August 12th 2016, 15:20:30:000' }
      ]
    },
    {
      accord: false,
      date: 'August 12th 2016, 13:00:00:000',
      details: [
        { flightNum: 'DDZ6PLZ', destCountry: 'IT', originWeather: 'Venice', avgTicketPrice1: '$120', distanceMiles: '0', avgTicketPrice2: '$120' },
        { flightNum: 'DDZ6PLZ', destCountry: 'IT', originWeather: 'Venice', avgTicketPrice1: '$120', distanceMiles: '0', avgTicketPrice2: '$120' },
        { flightNum: 'DDZ6PLZ', destCountry: 'IT', originWeather: 'Venice', avgTicketPrice1: '$120', distanceMiles: '0', avgTicketPrice2: '$120' },
        { flightNum: 'DDZ6PLZ', destCountry: 'IT', originWeather: 'Venice', avgTicketPrice1: '$120', distanceMiles: '0', avgTicketPrice2: '$120' }
      ],
      accordDetails: [
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: '', value2: '', flightNum2: '', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: '', value2: '', flightNum2: '', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: 'DDZ6PLZ', value2: '9.923', flightNum2: 'DDZ6PLZ', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: '', value2: '', flightNum2: '', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: '', value2: '', flightNum2: '', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: 'DDZ6PLZ', value2: '9.923', flightNum2: 'DDZ6PLZ', day: 'August 12th 2016, 15:20:30:000' }
      ]
    },
    {
      accord: false,
      date: 'August 12th 2016, 13:00:00:000',
      details: [
        { flightNum: 'DDZ6PLZ', destCountry: 'IT', originWeather: 'Venice', avgTicketPrice1: '$120', distanceMiles: '0', avgTicketPrice2: '$120' },
        { flightNum: 'DDZ6PLZ', destCountry: 'IT', originWeather: 'Venice', avgTicketPrice1: '$120', distanceMiles: '0', avgTicketPrice2: '$120' },
        { flightNum: 'DDZ6PLZ', destCountry: 'IT', originWeather: 'Venice', avgTicketPrice1: '$120', distanceMiles: '0', avgTicketPrice2: '$120' },
        { flightNum: 'DDZ6PLZ', destCountry: 'IT', originWeather: 'Venice', avgTicketPrice1: '$120', distanceMiles: '0', avgTicketPrice2: '$120' }
      ],
      accordDetails: [
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: '', value2: '', flightNum2: '', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: '', value2: '', flightNum2: '', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: 'DDZ6PLZ', value2: '9.923', flightNum2: 'DDZ6PLZ', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: '', value2: '', flightNum2: '', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: '', value2: '', flightNum2: '', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: 'DDZ6PLZ', value2: '9.923', flightNum2: 'DDZ6PLZ', day: 'August 12th 2016, 15:20:30:000' }
      ]
    },
    {
      accord: false,
      date: 'August 12th 2016, 13:00:00:000',
      details: [
        { flightNum: 'DDZ6PLZ', destCountry: 'IT', originWeather: 'Venice', avgTicketPrice1: '$120', distanceMiles: '0', avgTicketPrice2: '$120' },
        { flightNum: 'DDZ6PLZ', destCountry: 'IT', originWeather: 'Venice', avgTicketPrice1: '$120', distanceMiles: '0', avgTicketPrice2: '$120' },
        { flightNum: 'DDZ6PLZ', destCountry: 'IT', originWeather: 'Venice', avgTicketPrice1: '$120', distanceMiles: '0', avgTicketPrice2: '$120' },
        { flightNum: 'DDZ6PLZ', destCountry: 'IT', originWeather: 'Venice', avgTicketPrice1: '$120', distanceMiles: '0', avgTicketPrice2: '$120' }
      ],
      accordDetails: [
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: '', value2: '', flightNum2: '', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: '', value2: '', flightNum2: '', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: 'DDZ6PLZ', value2: '9.923', flightNum2: 'DDZ6PLZ', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: '', value2: '', flightNum2: '', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: '', value2: '', flightNum2: '', day: '' },
        { text: '# 15min_jcrLoad', value1: '9.923', flightNum1: 'DDZ6PLZ', value2: '9.923', flightNum2: 'DDZ6PLZ', day: 'August 12th 2016, 15:20:30:000' }
      ]
    }
  ];

  firstCardShowObject: any;
  remainingCardObjects: any;

  constructor() {
    window.scrollTo(0, 0);
    this.firstCardShowObject = this.cardObjects[0];
    this.remainingCardObjects = this.cardObjects.slice(1, this.cardObjects.length);
  }

  ngOnInit() {
  }

}
