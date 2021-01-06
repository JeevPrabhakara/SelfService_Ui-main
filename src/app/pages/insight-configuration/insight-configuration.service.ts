import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class InsightConfigureService {

    mainURl: string;

    constructor(private http: HttpClient) {
        this.mainURl = `${environment.serverUrl}`;
    }

    getAllPolicyConfig(): Observable<any> {
        const url = `${this.mainURl}/v1/policyConfig/getAllPolicyConfig`;
        return this.http.get(url);
    }

    getFilteredModelStatus(): Observable<any>{
        const url = `${this.mainURl}/v1/policyConfig/getEnabledPolicyConfig`;
        return this.http.get(url);
    }

    deletePolicyConfig(configId: number): Observable<any> {
        const url = `${this.mainURl}/v1/policyConfig/deleteConfig/${configId}`;
        return this.http.delete(url);
    }

    deletePolicyConfigs(configIds: number[]): Observable<any> {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            body: {
                configIds: [11111, 22222]
            }
        }
        const url = `${this.mainURl}/v1/policyConfig/deleteConfigs`;
        return this.http.delete(url, options);
    }

    getAllNistValues() {
        const url = `${this.mainURl}/getAllNistValues`;
        return this.http.get(url);
    }

    getAllMitreTactics() {
        const url = `${this.mainURl}/getAllMitreTactics`;
        return this.http.get(url);
    }

    getMitreTechniquesByMitreTacticId(mitreTacticId: number) {
        const url = `${this.mainURl}/getMitreTechniquesByMitreTacticId/${mitreTacticId}`;
        return this.http.get(url);
    }

}