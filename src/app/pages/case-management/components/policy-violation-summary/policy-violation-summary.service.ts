import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PolicyViolationSummaryService {

    private theme: string;
    apiPath: string;

    constructor(private http: HttpClient) {
        this.apiPath = `${environment.serverUrl}/v1`;
    }

    getPolicyDetails(violationId, eventDateTime, dataAggregated) {
        const url = `${this.apiPath}/pvCasemgmt/findOrAddPolicyViolationSummary/${violationId}/${eventDateTime}/${dataAggregated}`;
        return this.http.post(url, {});
    }

    createIncident(violationData) {
        const url = `${this.apiPath}/incident/createIncident`;
        return this.http.post(url, violationData);
    }

    updatePolicy(policyData, violationId) {
        const url = `${this.apiPath}/pvCasemgmt/updatepolicyViolation/${violationId}`;
        return this.http.patch(url, policyData, {responseType: 'text'});
    }

    downloadPolicyViolationSummaryAttachment(attachementId) {
        const url = `${this.apiPath}/downloadPolicyUploadedFileByAttachId/${attachementId}`;
        return this.http.get(url, {responseType: 'blob'});
    }

    assignPolicyToUser(violationId) {
        const url = `${this.apiPath}/pvCasemgmt/assigntoMePolicy/${violationId}`;
        return this.http.patch(url, {}, {responseType: 'text'});
    }

    uploadPolicyViolationSummaryAttachment(fileData, attachedFileDetails) {
            const uploadUrl = '/uploadPolicyViolationSummaryAttachment';
            const url = `${this.apiPath}/uploadPolicyViolationSummaryAttachment`;
            const formData: FormData = new FormData();
            formData.append('attachFile', fileData);
            formData.append('attachFileDetails', attachedFileDetails);
            return this.http.post(url, formData, {responseType: 'json'});
    }


    addComment(comment) {
        const url = `${this.apiPath}/pvCasemgmt/save/policycomments`;
        return this.http.post(url, comment);
    }

    deleteComment(commentId) {
        const url = `${this.apiPath}/pvCasemgmt/deletePolicyComment/${commentId}`;
        return this.http.delete(url, {responseType: 'text'});
    }

    savePolicyViolationActivity(activity) {
        const url = `${this.apiPath}/pvCasemgmt/save/policyViolationactivity`;
        return this.http.post(url, activity, {responseType: 'json'});
    }

    getTaggedUsers(pvId) {
        const url = `${this.apiPath}/pvCasemgmt/getTaggedUsers/${pvId}`;
        return this.http.get(url);
    }
}
