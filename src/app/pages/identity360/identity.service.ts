import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  mainURL: string;

  constructor(private http: HttpClient) {
    this.mainURL = `${environment.serverUrl}/v1`;
  }

  getAllEntities(entity, risk, offset, size) {
    const url = `${this.mainURL}/entity/getEntityview/${entity}/${risk}/DESC/${offset}/${size}/0`;

    return this.http.get(url);
  }

  // http://dev2.cetas.ai:9090/cybernetix/v1/entity/groupUserBy/0/ASC/0/0/0
  getFilteredEntities(body) {
    const url = `${this.mainURL}/entity/groupUserBy/85/DESC/0/10000`;
    return this.http.post(url, body);
  }

  getUsersByStatusOrType(body, offset, size, risk) {
    const url = `${this.mainURL}/identity/getUsersByStatusOrType/${offset}/${size}/${risk}`;
    return this.http.post(url, body);
  }
}
