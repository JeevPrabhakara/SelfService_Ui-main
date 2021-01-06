import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class IncidentSummaryService {

    private theme: string;
    apiPath: string;

    constructor(private http: HttpClient) {
        this.apiPath = `${environment.serverUrl}/v1`;
    }

    getIncidentDetials(violationId) {
        const url = `${this.apiPath}/incident/getIncidentSummary/${violationId}`;
        return this.http.get(url);
    }

    assignIncidentToUser(incidentId) {
        const url = `${this.apiPath}/incident/assigntoMeIncident/${incidentId}`;
        return this.http.patch(url, {}, { responseType: 'text' });
    }

    uploadIncidentSummaryAttachment(fileData, attachedFileDetails) {
        const url = `${this.apiPath}/uploadIncidentSummaryAttachment`;
        const formData: FormData = new FormData();
        formData.append('attachFile', fileData);
        formData.append('attachFileDetails', attachedFileDetails);
        return this.http.post(url, formData, { responseType: 'json' });
    }

    downloadIncidentSummaryAttachment(attachementId) {
        const url = `${this.apiPath}/downloadIncidentUploadedFileByAttachId/${attachementId}`;
        return this.http.get(url, { responseType: 'blob' });
    }

    updateIncident(incidentData, incId) {
        const url = `${this.apiPath}/incident/updateIncident/${incId}`;
        return this.http.patch(url, incidentData, { responseType: 'text' });
    }

    closeIncident(owner: string, incidentId: number, outcome: string) {
        const url = `${this.apiPath}/caseMgmt/entity/closeIncident/${owner}/${incidentId}/${outcome}`;
        return this.http.get(url);
    }

    saveIncidentActivity(activity) {
        const url = `${this.apiPath}/incident/save/incidentactivity`;
        return this.http.post(url, activity, { responseType: 'json' });
    }

    setIncidentOutcome(outcomeData) {
        const url = `${this.apiPath}/incident/setoutcome`;
        return this.http.patch(url, outcomeData);
    }

    addComment(comment) {
        const url = `${this.apiPath}/incident/save/incidentcomment`;
        return this.http.post(url, comment, { responseType: 'json' });
    }

    deleteComment(commentId) {
        const url = `${this.apiPath}/incident/deletePolicyComment/${commentId}`;
        return this.http.delete(url, { responseType: 'text' });
    }

    getTaggedUsersforIncident(incId) {
        const url = `${this.apiPath}/incident/getTaggedUsers/${incId}`;
        return this.http.get(url);
    }

}
