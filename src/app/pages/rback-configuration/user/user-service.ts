import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class UserService {

  mainURL = `${environment.serverUrl}/v1/user`;
  constructor(private http: HttpClient) { }

  getAllUsers() {
    const url = `${this.mainURL}/getAllUsers`;
    return this.http.get(url);
  }

  activateDeactivateUser(userId) {
    const url = `${this.mainURL}/activateDeactivateUser/${userId}`;
    return this.http.get(url);
  }

  changePasswordByAdmin(requestBody) {
    const url = `${this.mainURL}/changePasswordByAdmin`;
    return this.http.put(url, requestBody);
  }

  getAllUserNames() {
    const url = `${this.mainURL}/getAllUserNames`;
    return this.http.get(url);
  }

  getUserByUserId(userId) {
    const url = `${this.mainURL}/getUserByUserId/${userId}`;
    return this.http.get(url);
  }

  getUserByUserName(userName) {
    const url = `${this.mainURL}/getUserByUserName/${userName}`;
    return this.http.get(url);
  }

  createUser(userMaster: any) {
    const url = `${this.mainURL}/createUser`;
    return this.http.post(url, userMaster);
  }

  updateUser(userMaster: any) {
    const url = `${this.mainURL}/updateUser`;
    return this.http.put(url, userMaster);
  }

  deleteUserByAdmin(userId) {
    const url = `${this.mainURL}/deleteUserByAdmin/${userId}`;
    return this.http.delete(url);
  }

  getLoggedinUser() {
    const url = `${this.mainURL}/getLoggedinUser`;
    return this.http.get(url);
  }

}
