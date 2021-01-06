import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Comment } from './comment';
import { PolicyViolationSummaryService } from './policy-violation-summary.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../../../core/login/login.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { environment } from '../../../../../environments/environment';
import { UtilDataService } from '../../../../core/services/util.data.service';

export interface User {
    name: string;
    value: string;
}
@Component({
    selector: 'app-policy-violation-summary',
    templateUrl: './policy-violation-summary.component.html'
})
export class PolicyViolationSummaryComponent implements OnInit {

    priority: any = '';
    status: any = '';
    users: any;
    isUpdate: boolean = false;
    selectedPolicy: any;
    eventDateTime: any;
    filteredTaggedValue: any;
    dataAggregated: any;
    taggedUsers = [];
    taggedUsersForViolation: any;
    autoForTaggedUser: any;
    @ViewChild('autoForTaggedUser') matAutocomplete: MatAutocomplete;
    filteredUsers: Observable<string[]>;
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    policyDetailsCopy = {
        pv_ID: 0,
        attachedFiles: [],
        priority: '',
        status: '',
        policyCommentsEntities: [],
        policyReviewer: { userName: '', firstName: '', lastName: '' }
    };
    policyDetails = {
        entity: '',
        violationName: '',
        violatorId: '',
        shortenUrl: '',
        violation_date: '',
        violation_id: '',
        indicatorsCount: '',
        elasticKillChainName: '',
        elasticCategory: '',
        elasticSubCategory: '',
        incId: 0,
        pv_ID: 0,
        attachedFiles: [],
        elasticPolicyDescription: '',
        priority: '',
        status: '',
        policyCommentsEntities: [],
        policyViolationActivities: [],
        policyReviewer: { userName: '', firstName: '', lastName: '' }
    };
    fileToUpload = {};

    myControl = new FormControl();
    taggedUserCtrl = new FormControl();
    reviewers: User[] = [];
    filteredOptions: Observable<User[]>;
    @ViewChild('autosize') autosize: CdkTextareaAutosize;
    @ViewChild('taggedUserInput') taggedUserInput: ElementRef<HTMLInputElement>;
    d = new Date();
    policyComments: Comment[] = [];

    commentFormGroup: FormGroup;
    commentValue: AbstractControl;
    replyComment: AbstractControl;

    constructor(private formBuilder: FormBuilder, private policyViolationSummaryService: PolicyViolationSummaryService,
        private routeParam: ActivatedRoute, private router: Router,
        private _snackBar: MatSnackBar, private loginService: LoginService, private utilDataService: UtilDataService) {

        
        window.scrollTo(0, 0);
        this.initForm();
    }

    redirectToEntityDetailPage(violationType, violatorId) {
        switch (violationType) {
            case 'USER': window.open('/#/riskyUser/' + violatorId);
                break;
            case 'IP': window.open('/#/riskyIP/' + violatorId);
                break;
            case 'HOST': window.open('/#/riskyHost/' + violatorId);
                break;
        }
    }

    policyDataChange() {
        if (this.policyDetails.priority !== '' || this.policyDetails.status !== '' || this.myControl.value !== null) {
            this.isUpdate = true;
        }
    }

    initForm() {
        this.commentFormGroup = this.formBuilder.group({
            commentValue: ['', Validators.compose([Validators.required])],
            replyComment: ['', Validators.compose([Validators.required])]
        });

        this.commentValue = this.commentFormGroup.controls['commentValue'];
        this.replyComment = this.commentFormGroup.controls['replyComment'];
    }

    submitComment(parentId) {
        const comment = new Comment(this.commentValue.value, this.policyDetails.pv_ID, parentId, []);
        comment.taggedUserIds = [];
        this.taggedUsers.forEach((taggedUser) => {
            comment.taggedUserIds.push(taggedUser.userId);
        });
        //console.log(comment);
        this.policyViolationSummaryService.addComment(comment).subscribe((res: any) => {
            this.policyDetails.policyCommentsEntities.unshift(res);
            this.taggedUsers = [];
            this.savePolicyViolationActivity('added a comment', 'COMMENT_POSTED');
            this.getTaggedUsers();
        });
        this.commentValue.setValue('');
    }

    submitReply(commentObj, parentId) {
        if (commentObj.childCommentsModel === null) {
            commentObj.childCommentsModel = [];
        }
        const comment = new Comment(this.replyComment.value, this.policyDetails.pv_ID, parentId, []);
        this.policyViolationSummaryService.addComment(comment).subscribe((res: any) => {
            commentObj.childCommentsModel.unshift(res);
            commentObj.reply = false;
        });
        this.replyComment.setValue('');
    }

    ngOnInit() {
        this.getAllUsers();
        this.routeParam.paramMap.subscribe((params) => {
            this.selectedPolicy = params.get('violationId');
            this.eventDateTime = params.get('eventDateTime');
            this.dataAggregated = params.get('dataAggregated');
            this.getViolatedPolicy();
        });
    }

    getTaggedUsers() {
        this.policyViolationSummaryService.getTaggedUsers(this.policyDetails.pv_ID).subscribe((res: any) => {
            
            this.taggedUsersForViolation = res;
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

    selectReviewer() {
        if (!this.policyDetailsCopy.policyReviewer || this.myControl.value.value !== this.policyDetailsCopy.policyReviewer.userName)
            this.isUpdate = true;
        else {
            this._snackBar.open('Please assign to other user', null, {
                duration: 2000,
            });
        }
    }

    getAllUsers() {
        this.loginService.getAllUsers().subscribe((users: any) => {

            this.users = users;
            const loggedInUser = this.utilDataService.getLoggedInUser();
            if (this.users.find(user => user.userName === loggedInUser.userName)) {
                this.users.splice(this.users.findIndex(user => user.userName === loggedInUser.userName), 1);
            }

            this.filteredUsers = this.taggedUserCtrl.valueChanges.pipe(
                startWith(null),
                map((user: string | null) => user ? this._taggedUserFilter(user) : this.users.slice()));
            users.forEach(user => {
                if (user.userRoleDTOSet.length > 0 && user.userRoleDTOSet[0].roleName === 'ROLE_ADMIN') {
                    this.reviewers.push({ name: user.firstName + ' ' + user.lastName, value: user.userName });
                }
            });
            this.filteredOptions = this.myControl.valueChanges
                .pipe(
                    startWith(''),
                    map(value => typeof value === 'string' ? value : value.name),
                    map(name => name ? this._filter(name) : this.reviewers.slice())
                );
        });
    }

    getViolatedPolicy() {
        this.policyViolationSummaryService.getPolicyDetails(this.selectedPolicy, encodeURIComponent(this.eventDateTime), this.dataAggregated).subscribe((res: any) => {
           
            if (res) {
                this.policyDetails = res;
                this.getTaggedUsers();
                this.policyDetailsCopy = Object.assign({}, res);
                if (this.policyDetails.policyReviewer) {
                    const name = this.policyDetails.policyReviewer.firstName + ' ' + this.policyDetails.policyReviewer.lastName;
                    this.myControl.setValue({ name: name, value: this.policyDetails.policyReviewer.userName });

                    const loggedInUser = this.utilDataService.getLoggedInUser();
                    if (res.policyReviewer.usrId === loggedInUser.userId) {
                        this.showAssigMeButton = false;
                    } else
                        this.showAssigMeButton = true;
                } else
                    this.showAssigMeButton = true;
            }
        });
    }

    showAssigMeButton = true;

    assignPolicy(violationId) {
        this.policyViolationSummaryService.assignPolicyToUser(violationId).subscribe((response: any) => {
            if (response) {
                this.showAssigMeButton = false;

                response = JSON.parse(response);
                const name = response.firstName + ' ' + response.lastName;
                this.myControl.setValue({ name: name, value: response.userName });
                this.policyDetails.policyReviewer = response;
                this.policyDetailsCopy.policyReviewer = Object.assign({}, this.policyDetails.policyReviewer);
            }
            this.savePolicyViolationActivity('assigned this policy to himself', 'ASSIGN_TO_ME');
            this._snackBar.open('Assigned to you successfully', null, {
                duration: 2000,
            });

            this.isUpdate = false;
        });
    }

    private _taggedUserFilter(value) {
        if (typeof value === 'object') {
            this.filteredTaggedValue = value.userName.toLowerCase();
        } else {
            this.filteredTaggedValue = value.toLowerCase();
        }

        return this.users.filter(user => user.userName.toLowerCase().indexOf(this.filteredTaggedValue) === 0);
    }

    displayFn(user?: User): string | undefined {
        return user ? user.name : undefined;
    }

    uploadPolicyViolationFile(files: FileList) {
        this.fileToUpload = files.item(0);
        const policyStringifiedData = JSON.stringify({ 'pvId': this.policyDetails.pv_ID });
        this.policyViolationSummaryService.uploadPolicyViolationSummaryAttachment(this.fileToUpload, policyStringifiedData)
            .subscribe((res: any) => {
                this.policyDetails.attachedFiles.push(res);
                this.savePolicyViolationActivity('uploaded ' + res.fileName + ' file.', 'FILE_UPLOADED');
                this._snackBar.open('File uploaded successfully', null, {
                    duration: 2000,
                });
            });
    }

    downloadFile(data) {
        const binaryData = [];
        binaryData.push(data);
        const blob = new Blob(binaryData, { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
    }

    getPolicyAttachmentFile(attachementId, fileName) {
        this.savePolicyViolationActivity('downloaded ' + fileName + ' file.', 'FILE_DOWNLOADED');
        this.policyViolationSummaryService.downloadPolicyViolationSummaryAttachment(attachementId)
            .subscribe(data => this.downloadFile(data)),
            error => console.log('Error downloading the file.'),
            () => console.log('Completed file download.');
    }

    updatePolicy(violationId) {
        this.showAssigMeButton = true;
        const policyData = {
            'priority': this.policyDetails.priority,
            'reviewerUsrName': this.myControl.value.value,
            'status': this.policyDetails.status
        };
        this.policyViolationSummaryService.updatePolicy(policyData, violationId).subscribe((response: any) => {
            this.addFeedsForPolicyUpdate();
            this.getViolatedPolicy();
            this.isUpdate = false;
        });
        this._snackBar.open('Updated successfully', null, {
            duration: 2000,
        });
    }

    addFeedsForPolicyUpdate() {
        if (this.policyDetails.priority !== this.policyDetailsCopy.priority) {
            this.savePolicyViolationActivity('changed the priority to be ' + this.policyDetails.priority, 'PRIORITY_UPDATED');
        }

        if (this.policyDetails.status !== this.policyDetailsCopy.status) {
            this.savePolicyViolationActivity('changed the status to be ' + this.policyDetails.status, 'STATUS_UPDATED');
        }

        if (this.policyDetailsCopy.policyReviewer !== null) {
            if (this.myControl.value.value !== this.policyDetailsCopy.policyReviewer.userName) {
                this.savePolicyViolationActivity(`changed the reviewer to ${this.myControl.value.value}`, 'REVIEWER_ASSIGNED');
            }
        } else if (this.myControl.value.value) {
            this.savePolicyViolationActivity(`changed the reviewer to ${this.myControl.value.value}`, 'REVIEWER_ASSIGNED');
        }
    }

    deleteComment(comment) {
        comment.deleted = true;
        this.policyViolationSummaryService.deleteComment(comment.cmtId).subscribe((res: any) => {
            this.savePolicyViolationActivity('deleted a comment', 'COMMENT_DELETED');
            this.getTaggedUsers();
        });
    }

    private _filter(name: string): User[] {
        const filterValue = name.toLowerCase();

        return this.reviewers.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    savePolicyViolationActivity(feed, action) {
        const activityData = {
            'feed': feed,
            'actionType': action,
            'pvID': this.policyDetails.pv_ID
        };
        this.policyViolationSummaryService.savePolicyViolationActivity(activityData).subscribe((res: any) => {
            this.policyDetails.policyViolationActivities.unshift(res);
        });
    }

    createIncident() {
        const incidentData = {
            'status': 'NEW',
            'pvID': this.policyDetails.pv_ID
        };
        this.policyViolationSummaryService.createIncident(incidentData).subscribe((res: any) => {
            this._snackBar.open('Created Incident successfully', null, {
                duration: 2000,
            });
            if (res) {
                this.policyDetails.incId = res.incId;
                this.savePolicyViolationActivity('created an incident INC-' + res.incId, 'CREATE_AN_INCIDENT');
            } else {
                this.savePolicyViolationActivity('created an incident', 'CREATE_AN_INCIDENT');
            }
        });
    }

    fetchEnrichIndexKibanaURL(urlId) {
        const formatedUrlId = urlId;
        window.open(`${environment.kibanaLink}/goto/${urlId}`);
    }

}
