import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class RiskyUserService {

    mainURL: string;

    constructor(private http: HttpClient) {
        this.mainURL = `${environment.serverUrl}/v1`;
    }

    getRiskyEntityDetails(entityId, entityType) {
        const url = `${this.mainURL}/entity/${entityType}?entityId=${entityId}`;
        return this.http.get(url);
    }

    getRiskyUserCountDetails(entityId) {
        const url = `${this.mainURL}/entity/counts?entityId=${entityId}`;
        return this.http.get(url);
    }

    getPolicyViolationsForEntity(entityId, startDate, endDate) {
        const url = `${this.mainURL}/entity/policiesViolation/${startDate}/${endDate}?entityId=${entityId}`;
        return this.http.get(url);
    }

    getViolationSummary(ruleId, userId, isotimestamp) {
        const url = `${this.mainURL}/api/dashboard/getViolationSummary?ruleId=${ruleId}&userId=${userId}&timeStamp=${isotimestamp}`;
        return this.http.get(url);
    }

    getPolicyViolationForGivenPeriod(entityId, startDate, endDate, offset) {
        const url = `${this.mainURL}/entity/policiesViolationsummaryDetails/${startDate}/${endDate}?offset=${offset}&entityId=${entityId}`;
        return this.http.get(url);
    }

    newIncidentCreation(incidentBody): Observable<any> {
        const url = `${this.mainURL}/caseMgmt/entity/newIncident`;
        return this.http.post(url, incidentBody);
    }

    getDayBasisRiskScore(entityId) {
        const url = `${this.mainURL}/entity/linegraph?entityId=${entityId}`;
        return this.http.get(url);
    }

    fetchEnrichIndexKibanaURL(entityId, violationEventDateTime, ruleId, entityType) {
        const url = `${this.mainURL}/entity/fetchEnrichIndexKibanaURL/${entityType}/${violationEventDateTime}/${ruleId}?entityId=${entityId}`;
        return this.http.get(url);
    }

    fetchKibanaRawEventindex(entityId, entityType, enrichEventId) {
        const body = {
            entityId: entityId,
            entityType: entityType,
            enrichEventIds: enrichEventId
        }
        const url = `${this.mainURL}/entity/fetchKibanaRawEventindex`;
        return this.http.post(url, body);
    }

    rawEventCount(lastViolationId) {
        const url = `${this.mainURL}/entity/rawEventCount?violationId=${lastViolationId}`;
        return this.http.get(url);
    }

}
