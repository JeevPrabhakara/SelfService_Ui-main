import { Injectable } from "@angular/core";
import { UserContext } from "../../core/services/userContext";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable()
export class DashboardService {
    private pieChart = {
        animate: {
            duration: 500,
            enabled: true
        },
        barColor: "red",
        trackColor: "#252c32",
        scaleColor: false,
        lineWidth: 7,
        lineCap: "circle"
    };

    private topInfoLight = [
        { total: "100 K", title: "Users", ico: "users@2x.png" },
        { total: "20 K", title: "IP Address", ico: "Ip@2x.png" },
        { total: "78", title: "Hosts", ico: "hostname@2x.png" },
        { total: "193", title: "High Risk Users", ico: "risky@2x.png" },
        {
            total: "1125",
            title: "Privileged Accounts",
            ico: "previledged users@2x.png"
        },
        { total: "1153", title: "Service Accounts", ico: "service@2x.png" },
        { total: "12 M", title: "Raw Logs", ico: "logs@1x.png" },
        { total: "121 K", title: "Parsed Logs", ico: "noun_Check@1x.png" },
        { total: "950", title: "Roles", ico: "entities@1x.png" },
        { total: "156", title: "Insights", ico: "violations@2x.png" },
        { total: "85", title: "Incidents", ico: "incident@2x.png" },
        { total: "17", title: "Actions", ico: "actions@1x.png" }
    ];

    private topInfoDark = [
        { total: "100 K", title: "Users", ico: "users@2x.png" },
        { total: "20 K", title: "IP Address", ico: "Ip@2x.png" },
        { total: "78", title: "Hosts", ico: "hostname@2x.png" },

        {
            total: "1125",
            title: "Privileged Accounts",
            ico: "previledged users@2x.png"
        },
        { total: "1153", title: "Service Accounts", ico: "service@2x.png" },
        { total: "12 M", title: "Event Imported", ico: "logs@1x.png" },
        { total: "950", title: "High Risk IPs", ico: "entities@1x.png" },
        { total: "193", title: "High Risk Users", ico: "risky@2x.png" },
        { total: "160", title: "High Risk Hostnames", ico: "hostname@2x.png" },
        { total: "156", title: "Insights", ico: "violations@2x.png" },
        { total: "85", title: "Incidents", ico: "incident@2x.png" },
        { total: "17", title: "Actions", ico: "actions@1x.png" }
    ];

    private theme: string;
    mainURl: string;

    constructor(private userContext: UserContext, private http: HttpClient) {
        this.theme = this.userContext.getTheme();
        this.updateDefaultPie();
        this.mainURl = `${environment.serverUrl}/v1/dashboard`;
    }

    get defaultPieChart() {
        return this.pieChart;
    }

    getTopInfo() {
        if (this.theme == "black-theme") {
            return this.topInfoDark;
        } else {
            return this.topInfoLight;
        }
    }

    getDashboardCounts() {
        const url = `${this.mainURl}/counts/all`;
        return this.http.get(url);
    }

    getRiskCountByDepartment() {
        const url = `${this.mainURl}/riskscountbydepartment/0/50?size=5`;
        return this.http.get(url);
    }

    getRiskCountByTitle() {
        const url = `${this.mainURl}/riskscountbytitle/0/0?size=5`;
        return this.http.get(url);
    }

    getRiskCountByLocation() {
        const url = `${this.mainURl}/riskscountbycountry/0?size=5`;
        return this.http.get(url);
    }

    searchUserByName(entityName) {
        const url = `${this.mainURl}/searchRiskyEntities?entityName=${entityName}`;
        return this.http.get(url);
    }

    getAiPredictions(offset, size){
        const url = `${this.mainURl}/getTopPredictions/${offset}/${size}`;
        return this.http.get(url);
    }

    // http://localhost:9090/cybernetix/v1/dashboard/getRiskTrend/10
    getRiskTrend(size){
        const url = `${this.mainURl}/getRiskTrend/${size}`;
        return this.http.get(url);
    }

    updateDefaultPie() {
        switch (this.theme) {
            case "black-theme": {
                this.pieChart.barColor = environment.blackThemeBrandColor;
                this.pieChart.trackColor =
                    environment.blackThemePieChartTrackColor;
                break;
            }
            case "blue-theme": {
                this.pieChart.barColor = environment.blueThemeBrandColor;
                this.pieChart.trackColor =
                    environment.blueThemePieChartTrackColor;
                break;
            }
        }
    }
}
