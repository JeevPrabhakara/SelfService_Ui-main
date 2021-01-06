import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class UtilService {

    menuStatus: boolean = false;
    // isAIR: boolean = false;
    private currentUserProfile = new Subject<string>();
    // currentUserProfile: string;


    constructor() { }
      // Observable string sources


  // Observable string streams
  currentUserProfile$ = this.currentUserProfile.asObservable();

  // Service message commands
  setProfile(profile: string) {
    this.currentUserProfile.next(profile);
  }


    set isMenuOpened(menuStatus) {
        this.menuStatus = menuStatus;
    }

    get isMenuOpened() {
        return this.menuStatus;
    }

    // set userProfile(isAIR) {
    //     this.isAIR = isAIR;
    // }

    // get userProfile() {
    //     return this.isAIR;
    // }

}
