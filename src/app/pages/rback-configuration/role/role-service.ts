import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class RoleService {

  mainURL = `${environment.serverUrl}/v1/role`;
  constructor(private http: HttpClient) { }

  getAllRoleMasters() {
    const url = `${this.mainURL}/getAllRoleMasters`;
    return this.http.get(url);
  }

  getAllRoleMasterNames() {
    const url = `${this.mainURL}/getAllRoleMasterNames`;
    return this.http.get(url);
  }

  getRoleMasterById(roleMasterId) {
    const url = `${this.mainURL}/getRoleMasterById/${roleMasterId}`;
    return this.http.get(url);
  }

  getAllPermissions() {
    const url = `${this.mainURL}/getAllPermissions`;
    return this.http.get(url);
  }

  addRoleMaster(roleMaster: any) {
    const url = `${this.mainURL}/addRoleMaster`;
    return this.http.post(url, roleMaster);
  }

  updateRoleMaster(roleMaster: any) {
    const url = `${this.mainURL}/updateRoleMaster`;
    return this.http.put(url, roleMaster);
  }

  deleteRoleMasterByRoleMasterId(roleMasterId) {
    const url = `${this.mainURL}/deleteRoleMasterById/${roleMasterId}`;
    return this.http.delete(url);
  }

}
