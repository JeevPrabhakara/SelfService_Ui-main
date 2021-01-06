import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Comment } from './comment';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IncidentSummaryService } from './incident-summary.service';
import { LoginService } from '../../../../core/login/login.service';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { environment } from '../../../../../environments/environment';
import { UtilDataService } from '../../../../core/services/util.data.service';

export interface User {
    name: string;
}

@Component({
    selector: 'app-policy-violation-summary',
    templateUrl: './incident-summary.component.html'
})
export class IncidentSummaryComponent implements OnInit {

   
    status: any = '';
    isUpdate: boolean = false;
    selectedPolicy: any;
    caseowners = [];
    taggedUsers = [];
    filteredTaggedValue: any;
    taggedUsersForIncident: any;
    users: any;
    incidentDetailsCopy: any;
    incidentDetails = {
        incidentCreatedTime: '',
        elasticPolicyDescription: '',
        incidentName: '',
        violationTime: '',
        indicatorsCount: '',
        elasticKillChainName: '',
        shortenUrl: '',
        eventDate: '',
        elasticRiskScore: '',
        elasticCategory: '',
        elasticSubCategory: '',
        incId: 0,
        priority: '',
        status: '',
        outcome: 'OPEN',
        pvID: '',
        attachFiles: [],
        incidentactivities: [],
        incidentComments: [],
        incOwner: {
            firstName: '',
            userName: '',
            lastName: ''
        }
    };
    fileToUpload: any;
    policyComments: any[] = [];
    autoForTaggedUser: any;
    @ViewChild('autoForTaggedUser') matAutocomplete: MatAutocomplete;
    filteredUsers: Observable<User[]>;
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    myControl = new FormControl();
    taggedUserCtrl = new FormControl();
    @ViewChild('taggedUserInput') taggedUserInput: ElementRef<HTMLInputElement>;
    replyComment: AbstractControl;
    filteredOptions: Observable<User[]>;

    @ViewChild('autosize') autosize: CdkTextareaAutosize;

    d = new Date();

    threatCategorizationImages = [
        { title: 'Reconnaissance', icon: 'binary-search.png' },
        { title: 'Phishing Attack', icon: 'delivery.png' },
        { title: 'Suspicious Login', icon: 'foothold.png' },
        { title: 'Powershell Obfuscation', icon: 'monitor-code.png' },
        { title: 'Lateral Movement', icon: 'document-approval.png' },
        { title: 'Command and Control', icon: 'foothold.png' },
        { title: 'Data Exfiltration', icon: 'monitor-code.png' }
    ];

    killChainImages = [
        { title: 'Reconnaissance', icon: 'binary-search.png' },
        { title: 'Weaponization', icon: 'foothold.png' },
        { title: 'Delivery', icon: 'delivery.png' },
        { title: 'Exploitation', icon: 'monitor-code.png' },
        { title: 'Installation', icon: 'connection.png' },
        { title: 'Command and Control', icon: 'document-approval.png' },
        { title: 'Actions on Objective', icon: 'foothold.png' }
    ];

    killChainProcess = [
        { title: 'Recon', icon: 'binary-search.png', isKill: 0 },
        { title: 'Weaponization', icon: 'foothold.png', isKill: 1 },
        { title: 'Delivery', icon: 'delivery.png', isKill: 1 },
        { title: 'Exploitation', icon: 'foothold.png', isKill: 1 },
        { title: 'Installation', icon: 'monitor-code.png', isKill: 1 },
        { title: 'Command and Control', icon: 'connection.png', isKill: 0 },
        { title: 'Actions on objective', icon: 'document-approval.png', isKill: 0 }
    ];

    commentFormGroup: FormGroup;
    commentValue: AbstractControl;

    constructor(private formBuilder: FormBuilder, private routeParam: ActivatedRoute,
        private router: Router, private _snackBar: MatSnackBar, private incidentSummaryService: IncidentSummaryService,
        private loginService: LoginService, private utilDataService: UtilDataService) {

        window.scrollTo(0, 0);
        this.initForm();
    }

    loggedInUser: any;
    ngOnInit() {
        this.getAllUsers();

        this.loginService.getLoggedInUserDetails().subscribe((res: any) => {
           this.loggedInUser = res;
        });

        this.routeParam.paramMap.subscribe((params) => {
            this.selectedPolicy = params.get('policyViolationId');
            this.getIncident(this.selectedPolicy);
        });
    }

    incidentOutcomeChange() {
        /* if (this.incidentDetails.priority !== '' || this.incidentDetails.status !== '' || this.incidentDetails.outcome !== ''
            || this.myControl.value.name != null) {
            this.isUpdate = true;
        } */

        this.showUpdateButton = this.initialOutcome == 'OPEN' && this.initialOutcome != this.incidentDetails.outcome;
    }

    submitComment(parentId) {
        const comment = new Comment(this.commentValue.value, this.incidentDetails.incId, parentId, []);
        comment.taggedUserIds = []
        this.taggedUsers.forEach((taggedUser) => {
            comment.taggedUserIds.push(taggedUser.userId);
        });
        this.incidentSummaryService.addComment(comment).subscribe((res: any) => {
            this.incidentDetails.incidentComments.unshift(res);
            this.taggedUsers = [];
            this.saveIncidentActivity(this.loggedInUser.userName + ' added a comment', 'COMMENT_POSTED');
            this.getTaggedUsersForIncident();
        });
        this.commentValue.setValue('');
    }

    initForm() {

        this.commentFormGroup = this.formBuilder.group({
            commentValue: ['', Validators.compose([Validators.required])],
            replyComment: ['', Validators.compose([Validators.required])]
        });
        this.commentValue = this.commentFormGroup.controls['commentValue'];
        this.replyComment = this.commentFormGroup.controls['replyComment'];
    }

    private _taggedUserFilter(value): string[] {
        if (typeof value === 'object') {
            this.filteredTaggedValue = value.userName.toLowerCase();
        } else {
            this.filteredTaggedValue = value.toLowerCase();
        }

        return this.users.filter(user => user.userName.toLowerCase().indexOf(this.filteredTaggedValue) === 0);
    }

    investigateClick() {
        window.open(`${environment.kibanaLink}/goto/${this.incidentDetails.shortenUrl}`);
    }

    getAllUsers() {
        this.loginService.getAllUsers().subscribe((users: any) => {
   
            this.users = users;
            const loggedInUser = this.utilDataService.getLoggedInUser();            
            this.filteredUsers = this.taggedUserCtrl.valueChanges.pipe(
                startWith(null),
                map((user: string | null) => user ? this._taggedUserFilter(user) : this.users.slice()));
            users.forEach(user => {
                this.caseowners.push({ name: user.firstName, value: user.userName });
               
            });
            this.filteredOptions = this.myControl.valueChanges
                .pipe(
                    startWith(''),
                    map(value => typeof value === 'string' ? value : value.name),
                    map(name => name ? this._filter(name) : this.caseowners.slice())
                );
        });
    }

    selectedCaseOwner() {
        /* if (!this.incidentDetailsCopy.incOwner || this.myControl.value.value !== this.incidentDetailsCopy.incOwner.userName)
            this.isUpdate = true;
        else {
            this._snackBar.open('Please assign to other user', null, {
                duration: 4000,
            });
        } */
        //console.log('initial owner : ' + this.initialCaseOwner);
        //console.log('value is : ' + this.myControl.value.value);
        if (this.initialCaseOwner == '' || this.initialCaseOwner != this.myControl.value.value) {
            this.showUpdateButton = true;
        } else {
            this.showUpdateButton = false;
            this._snackBar.open('Please assign to other user', null, {
                duration: 4000,
            });
        }
    }

    displayFn(user?: User): string | undefined {
        return user ? user.name : undefined;
    }

    showAssigMeButton = true;
    showUpdateButton = false;

    getIncident(pvId) {
        this.incidentSummaryService.getIncidentDetials(pvId).subscribe((res: any) => {
            if (res) {
                res.elasticRiskScore = res.elasticRiskScore ? res.elasticRiskScore.toFixed(2) : 0;
                res.outcome = res && res.outcome ? res.outcome : 'OPEN';
                this.initialCaseOwner = res && res.incOwner && res.incOwner.userName ? res && res.incOwner.userName : '';

                this.initialOutcome = res.outcome;
                this.incidentDetails = res;

                res.incidentactivities.forEach(incActivity => {
                    if (incActivity.feed.includes('FALSE_POSITIVE_WRONG_DETECTION'))
                        incActivity.feed = incActivity.feed.replace('FALSE_POSITIVE_WRONG_DETECTION', 'False Positive Wrong Detection');
                    else if (incActivity.feed.includes('FALSE_POSITIVE_RIGHT_DETECTION'))
                        incActivity.feed = incActivity.feed.replace('FALSE_POSITIVE_RIGHT_DETECTION', 'False Positive Correct Detection');
                    else if (incActivity.feed.includes('OPEN'))
                        incActivity.feed = incActivity.feed.replace('OPEN', 'Open');
                    else if (incActivity.feed.includes('TRUE_POSITIVE'))
                        incActivity.feed = incActivity.feed.replace('TRUE_POSITIVE', 'True Positive');
                });

                if (res.incOwner != null) {
                    this.initialOutcome = new String(res.outcome);
                    this.initialCaseOwner = new String(res.incOwner.userName);
                }

                this.getTaggedUsersForIncident();
                this.incidentDetailsCopy = Object.assign({}, res);
                if (this.incidentDetails.incOwner) {
                    this.myControl.setValue({
                        name: this.incidentDetails.incOwner.firstName,
                        value: this.incidentDetails.incOwner.userName
                    });

                    const loggedInUser = this.utilDataService.getLoggedInUser();
                    if (res.incOwner.usrId === loggedInUser.userId) {
                        this.showAssigMeButton = false;
                    } else {
                        this.showAssigMeButton = true;
                    }
                } else
                    this.showAssigMeButton = true;
            }
        });
    }

    getTaggedUsersForIncident() {
        this.incidentSummaryService.getTaggedUsersforIncident(this.incidentDetails.incId).subscribe((res: any) => {
            this.taggedUsersForIncident = res;
        });
    }

    assignIncident(incidentId) {
        this.incidentSummaryService.assignIncidentToUser(incidentId).subscribe((response: any) => {
            if (response) {
                this.showAssigMeButton = false;
                response = JSON.parse(response);
                this.incidentDetails.incOwner = response;
                this.incidentDetailsCopy.incOwner = Object.assign({}, this.incidentDetails.incOwner);
                this.myControl.setValue({
                    name: this.incidentDetails.incOwner.firstName,
                    value: this.incidentDetails.incOwner.userName
                });
            }
            this.saveIncidentActivity('assigned this incident to himself', 'ASSIGN_TO_ME');
            this._snackBar.open('Assigned to you successfully', null, {
                duration: 2000,
            });

            this.isUpdate = false;
        });
    }

    submitReply(commentObj, parentId) {
        if (commentObj.childCommentsModel === null) {
            commentObj.childCommentsModel = [];
        }
        const comment = new Comment(this.replyComment.value, this.incidentDetails.incId, parentId, []);
        this.incidentSummaryService.addComment(comment).subscribe((res: any) => {
            commentObj.childCommentsModel.unshift(res);
            commentObj.reply = false;
        });
        this.replyComment.setValue('');
    }

    uploadIncidentSummaryFile(files: FileList) {
        this.fileToUpload = files.item(0);
        const policyStringifiedData = JSON.stringify({ 'incidentEntityId': this.incidentDetails.incId });
        this.incidentSummaryService.uploadIncidentSummaryAttachment(this.fileToUpload, policyStringifiedData).subscribe((res: any) => {
            this.incidentDetails.attachFiles.push(res);
            this.saveIncidentActivity('uploaded ' + res.fileName + ' file.', 'FILE_UPLOADED');
            this._snackBar.open('File uploaded successfully', null, {
                duration: 2000,
            });
        });
    }

    add(event: MatChipInputEvent): void {
        if (!this.matAutocomplete.isOpen) {
            const input = event.input;
            const value = event.value;

            if ((value || '').trim()) {
                this.taggedUsers.push(value);
            }

            // Reset the input value
            if (input) {
                input.value = '';
            }

            this.taggedUserCtrl.setValue(null);
        }
    }

    remove(user: string): void {
        const index = this.taggedUsers.indexOf(user);

        if (index >= 0) {
            this.taggedUsers.splice(index, 1);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.taggedUsers.push(event.option.value);
        this.taggedUserInput.nativeElement.value = '';
        this.taggedUserCtrl.setValue(null);
    }

    updateOutcome() {
        const outcomeData = {
            'incID': this.incidentDetails.incId,
            'outcome': this.incidentDetails.outcome
        };
        this.incidentSummaryService.setIncidentOutcome(outcomeData).subscribe((res: any) => {
            this.saveIncidentActivity('changed the outcome to ' + this.incidentDetails.outcome, 'INCIDENT_OUTCOME');
        });
    }

    initialOutcome: String = 'OPEN';
    initialCaseOwner: String = '';

    closeIncident() {
        const userName = this.myControl.value ? this.myControl.value.value : '';
        const userNameReq = userName == '' ? this.loggedInUser.userName : userName;
        this.incidentSummaryService.closeIncident(userNameReq, this.incidentDetails.incId, this.incidentDetails.outcome)
            .subscribe(res => {

            });

        var feedMessage = '';
        var actionType = '';
        const loggedInUser = this.loggedInUser;
        const assingedToMe = userName && userName === loggedInUser.userName ? true : false;
        const outcomeChanged = this.incidentDetails.outcome != this.initialOutcome ? true : false;
        const ownerChanged = userName != this.initialCaseOwner ? true : false;

        if (outcomeChanged && ownerChanged && assingedToMe) {
            feedMessage = loggedInUser.userName + ' changed outcome to ' + this.incidentDetails.outcome + ' and assigned the incident to himself';
            actionType = 'OWNER_OUTCOME_ASSIGNED';
        } else if (outcomeChanged && ownerChanged && !assingedToMe) {
            feedMessage = loggedInUser.userName + ' changed outcome to ' + this.incidentDetails.outcome + ' and assigned the incident to ' + this.myControl.value.value;
            actionType = 'OWNER_OUTCOME_ASSIGNED';
        } else if (outcomeChanged && !ownerChanged) {
            feedMessage = loggedInUser.userName + ' changed outcome to ' + this.incidentDetails.outcome;
            actionType = 'INCIDENT_OUTCOME';
        } else if (ownerChanged && !outcomeChanged && !assingedToMe) {
            feedMessage = loggedInUser.userName + ' assigned the incident to ' + userName;
            actionType = 'CASE_OWNER_ASSIGNED';
        } else if (!outcomeChanged && ownerChanged && assingedToMe) {
            feedMessage = loggedInUser.userName + ' assigned the incident to himself';
            actionType = 'ASSIGN_TO_ME';
        }

        const activityData = {
            'feed': feedMessage,
            'actionType': actionType,
            'incID': this.incidentDetails.incId
        };

        this.incidentSummaryService.saveIncidentActivity(activityData).subscribe((res: any) => {
            this.initialOutcome = this.incidentDetails.outcome;
            this.showUpdateButton = false;
            this.initialCaseOwner = this.myControl.value ? this.myControl.value.value : '';

            if (res.feed.includes('FALSE_POSITIVE_WRONG_DETECTION'))
                res.feed = res.feed.replace('FALSE_POSITIVE_WRONG_DETECTION', 'False Positive Wrong Detection');
            else if (res.feed.includes('FALSE_POSITIVE_RIGHT_DETECTION'))
                res.feed = res.feed.replace('FALSE_POSITIVE_RIGHT_DETECTION', 'False Positive Correct Detection');
            else if (res.feed.includes('OPEN'))
                res.feed = res.feed.replace('OPEN', 'Open');
            else if (res.feed.includes('TRUE_POSITIVE'))
                res.feed = res.feed.replace('TRUE_POSITIVE', 'True Positive');
            this.incidentDetails.incidentactivities.unshift(res);

            this._snackBar.open('Updated successfully', null, {
                duration: 2000,
            });
        }, error => {
            this._snackBar.open('Updated Failed', null, {
                duration: 2000,
            });
        });

        /* this.initialCaseOwner = new String(this.myControl.value.value);
        this.initialOutcome = new String(this.incidentDetails.outcome); */
        // debugger
        //console.log(activityData + '...');
    }

    saveIncidentActivity(feed, action) {
        const activityData = {
            'feed': feed,
            'actionType': action,
            'incID': this.incidentDetails.incId
        };
        this.incidentSummaryService.saveIncidentActivity(activityData).subscribe((res: any) => {
            if (res.feed.includes('FALSE_POSITIVE_WRONG_DETECTION'))
                res.feed = res.feed.replace('FALSE_POSITIVE_WRONG_DETECTION', 'False Positive Wrong Detection');
            else if (res.feed.includes('FALSE_POSITIVE_RIGHT_DETECTION'))
                res.feed = res.feed.replace('FALSE_POSITIVE_RIGHT_DETECTION', 'False Positive Correct Detection');
            else if (res.feed.includes('OPEN'))
                res.feed = res.feed.replace('OPEN', 'Open');
            else if (res.feed.includes('TRUE_POSITIVE'))
                res.feed = res.feed.replace('TRUE_POSITIVE', 'True Positive')
            this.incidentDetails.incidentactivities.unshift(res);
        });
    }

    updateIncident() {
        this.showAssigMeButton = true;
        if (this.incidentDetails.status === 'CLOSED') {
            this.updateOutcome();
        }
        const incidentData = {
            'priority': this.incidentDetails.priority,
            'incOwnerUsrName': this.myControl.value.value,
            'status': this.incidentDetails.status
        };
        this.incidentSummaryService.updateIncident(incidentData, this.incidentDetails.incId).subscribe((response: any) => {
            this.addFeedsForIncidentUpdate();
            this.getIncident(this.selectedPolicy);
            this.isUpdate = false;
        });

        this._snackBar.open('Updated successfully', null, {
            duration: 2000,
        });
    }

    downloadFile(data) {
        const binaryData = [];
        binaryData.push(data);
        const blob = new Blob(binaryData, { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
    }

    addFeedsForIncidentUpdate() {
        // debugger
        if (this.incidentDetails.priority !== this.incidentDetailsCopy.priority) {
            this.saveIncidentActivity('changed the priority to be ' + this.incidentDetails.priority, 'PRIORITY_UPDATED');
        }

        if (this.incidentDetails.status !== this.incidentDetailsCopy.status) {
            this.saveIncidentActivity('changed the status to be ' + this.incidentDetails.status, 'STATUS_UPDATED');
        }

        if (this.incidentDetailsCopy.incOwner !== null) {
            if (this.myControl.value.value !== this.incidentDetailsCopy.incOwner.userName) {
                this.saveIncidentActivity(`changed the case owner to ${this.myControl.value.value}`, 'CASE_OWNER_ASSIGNED');
            }
        } else if (this.myControl.value.value) {
            this.saveIncidentActivity(`changed the case owner to ${this.myControl.value.value}`, 'CASE_OWNER_ASSIGNED');
        }
    }

    getIncidentAttachmentFile(attachementId, fileName) {
        this.saveIncidentActivity('downloaded ' + fileName + ' file.', 'FILE_DOWNLOADED');
        this.incidentSummaryService.downloadIncidentSummaryAttachment(attachementId)
            .subscribe(data => this.downloadFile(data)),
            error => console.log('Error downloading the file.'),
            () => console.log('Completed file download.');
    }

    private _filter(name: string): User[] {
        const filterValue = name.toLowerCase();

        return this.caseowners.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    deleteComment(comment) {
        comment.deleted = true;
        this.incidentSummaryService.deleteComment(comment.incCmtId).subscribe((res: any) => {
            this.saveIncidentActivity(this.loggedInUser.userName + ' deleted a comment', 'COMMENT_DELETED');
            this.getTaggedUsersForIncident();
        });
    }

    fetchEnrichIndexKibanaURL(urlId) {
        const formatedUrlId = urlId;
        window.open(`${environment.kibanaLink}/goto/${urlId}`);
    }
}
