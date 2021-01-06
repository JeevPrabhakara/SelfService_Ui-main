import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InsightsService {
  mainURL: string;

  constructor(private http: HttpClient) {
    this.mainURL = `${environment.serverUrl}/v1`;
  }

  getAllAlerts(milliSec) {
    // const url = `${this.mainURL}/entity/getEntityview/${entity}/${risk}/DESC/${offset}/${size}/0`;
    // http://localhost:9090/cybernetix/v1/entity/alertsInsight/0
    const url = `${this.mainURL}/entity/alertsInsight/${milliSec}`;

    return this.http.get(url);
  }

  // http://dev2.cetas.ai:9090/cybernetix/v1/entity/groupUserBy/0/ASC/0/0/0
  getFilteredEntities(body) {
    const url = `${this.mainURL}/entity/groupUserBy/85/DESC/0/10000`;
    return this.http.post(url, body);
  }

  getAllIncidents(offset, size, startDateTime, endDateTime) {
    const url = `${this.mainURL}/caseMgmt/entity/getIncidents/${offset}/${size}/${startDateTime}/${endDateTime}`;
    return this.http.get(url);
  }

  getFilteredIncidentStatus() {
    // const url = `${this.mainURL}/caseMgmt/entity/getNonOpenIncidents`;
    const url = `${this.mainURL}/caseMgmt/entity/getNonOpenIncidents`;
    return this.http.get(url);
  }

  getAllIncidentData() {
    const url = `${this.mainURL}/caseMgmt/entity/getAllIncidents/`;
    return this.http.get(url);
  }
  getAllThreatStories(startDate){
    // v1/threats/getThreatStory/0
    const url = `${this.mainURL}/threats/getThreatStory/${startDate}`;
    return this.http.get(url);
  }
}
