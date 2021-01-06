import { Injectable } from '@angular/core';

@Injectable()
export class UtilDataService {

    filteredRiskyUsers: any[] = [];
    filteredRiskyHost: any[] = [];
    filteredRiskyIPAddress: any[] = [];
    loggedInUser: any;

    getFilteredRiskyUsers(): any[] {
        return this.filteredRiskyUsers;
    }

    getFilteredRiskyHosts(): any[] {
        return this.filteredRiskyHost;
    }

    getFilteredRiskyIPAddresses(): any[] {
        return this.filteredRiskyIPAddress;
    }

    getLoggedInUser() {
        return this.loggedInUser;
    }

    setLoggedInUser(loggedInUser) {
        this.loggedInUser = loggedInUser;
    }

}
