import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataOpsService {
  mainURL: string;

  constructor(private http: HttpClient) {
    this.mainURL = `${environment.serverUrl}/v1`;
  }

  getAllDataOps() {
    const url = `${this.mainURL}/entity/getdataResourceTrend`;

    return this.http.get(url);
  }
}
