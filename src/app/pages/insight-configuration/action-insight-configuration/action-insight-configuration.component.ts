import { Component, OnInit, NgZone, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, AbstractControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { InsightConfigureService } from '../insight-configuration.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-action-insight-configuration',
  templateUrl: './action-insight-configuration.component.html',
  styleUrls: ['./action-insight-configuration.component.scss']
})
export class ActionInsightConfigurationComponent implements OnInit {

  addInsightConfig = false;
  editInsightConfig = false;
  viewInsightConfig = false;
  insightConfigId: number;
  pageTitle = 'Add Insight Configuration';
  addPage = true;
  updatePage = false;
  viewPage = false;
  formSubmitted = false;

  insightConfForm: FormGroup;
  insightStatus: AbstractControl;
  insightName: AbstractControl;
  insightDescription: AbstractControl;
  author: AbstractControl;
  lastModifiedBy: AbstractControl;
  lastModifiedOn: AbstractControl;
  severity: AbstractControl;
  threatCategory: AbstractControl;
  threatSubCategory: AbstractControl;
  mitreTactic: AbstractControl;
  mitreTechnique: AbstractControl;
  nistControl: AbstractControl;
  cyberKillChain: AbstractControl;
  insightDefinition: AbstractControl;
  insightLogic: AbstractControl;
  expressions: AbstractControl;
  outputMechanism: AbstractControl;
  emailTo: AbstractControl;
  syslogReceiver: AbstractControl;

  initInsightConfForm() {
    this.insightConfForm = this.formBuilder.group({
      insightStatus: ['disable'],
      insightName: ['', Validators.compose([Validators.required])],
      insightDescription: ['', Validators.compose([Validators.required])],
      author: [{ value: '', disabled: true }],
      lastModifiedBy: [{ value: '', disabled: true }],
      lastModifiedOn: [{ value: '', disabled: true }],
      severity: ['', Validators.compose([Validators.required])],
      threatCategory: ['', Validators.compose([Validators.required])],
      threatSubCategory: ['', Validators.compose([Validators.required])],
      mitreTactic: ['', Validators.compose([Validators.required])],
      mitreTechnique: ['', Validators.compose([Validators.required])],
      nistControl: ['', Validators.compose([Validators.required])],
      cyberKillChain: ['', Validators.compose([Validators.required])],
      insightDefinition: [{ value: 'advance', disabled: true }],
      insightLogic: ['', Validators.compose([Validators.required])],
      expressions: ['', Validators.compose([Validators.required])],
      outputMechanism: ['emailOutput'],
      emailTo: [''],
      syslogReceiver: ['']
    });

    this.insightStatus = this.insightConfForm.controls['insightStatus'];
    this.insightName = this.insightConfForm.controls['insightName'];
    this.insightDescription = this.insightConfForm.controls['insightDescription'];
    this.author = this.insightConfForm.controls['author'];
    this.lastModifiedBy = this.insightConfForm.controls['lastModifiedBy'];
    this.lastModifiedOn = this.insightConfForm.controls['lastModifiedOn'];
    this.severity = this.insightConfForm.controls['severity'];
    this.threatCategory = this.insightConfForm.controls['threatCategory'];
    this.threatSubCategory = this.insightConfForm.controls['threatSubCategory'];
    this.mitreTactic = this.insightConfForm.controls['mitreTactic'];
    this.mitreTechnique = this.insightConfForm.controls['mitreTechnique'];
    this.nistControl = this.insightConfForm.controls['nistControl'];
    this.cyberKillChain = this.insightConfForm.controls['cyberKillChain'];
    this.insightDefinition = this.insightConfForm.controls['insightDefinition'];
    this.insightLogic = this.insightConfForm.controls['insightLogic'];
    this.expressions = this.insightConfForm.controls['expressions'];
    this.outputMechanism = this.insightConfForm.controls['outputMechanism'];
    this.emailTo = this.insightConfForm.controls['emailTo'];
    this.syslogReceiver = this.insightConfForm.controls['syslogReceiver'];
  }

  severityItemList = [
    { "id": 1, "itemName": "Low" },
    { "id": 2, "itemName": "Medium" },
    { "id": 3, "itemName": "High" },
    { "id": 4, "itemName": "Critical" }
  ];

  cyberKillChainItemList = [
    { "id": 1, "itemName": "Reconnaissance" },
    { "id": 1, "itemName": "Weaponization" },
    { "id": 1, "itemName": "Delivery" },
    { "id": 1, "itemName": "Exploitation" },
    { "id": 1, "itemName": "Privilege Escalation" },
    { "id": 1, "itemName": "Installation" },
    { "id": 1, "itemName": "Command & Control" },
    { "id": 1, "itemName": "Lateral Movement" },
    { "id": 1, "itemName": "Execute" },
    { "id": 1, "itemName": "Maintain" },
    { "id": 1, "itemName": "Actions on Objectives" }
  ];

  mitreTacticList: any[] = [];
  mitreTechniqueList: any[] = [];
  NISTList: any[] = [];

  constructor(private activeRoute: ActivatedRoute, private router: Router, private ngbModal: NgbModal,
    private location: Location, private formBuilder: FormBuilder, private insightConfService: InsightConfigureService) {

    window.scrollTo(0, 0);
    this.initInsightConfForm();

    this.insightConfService.getAllMitreTactics()
      .subscribe(mitreTactics => this.mitreTacticList = <any[]>mitreTactics
        , error => console.log(error));

    this.insightConfService.getAllNistValues()
      .subscribe(nists => this.NISTList = <any[]>nists
        , error => console.log(error));
  }

  ngOnInit() {
    const url = this.router.url;
    if (!url.includes('add')) {
      this.addPage = false;
      this.activeRoute.paramMap.subscribe((params: Params) => {
        this.insightConfigId = params.get('insightConfId');
        if (url.includes('edit')) {
          this.pageTitle = 'Edit Insight Configuration';
          this.updatePage = true;
        } else {
          this.pageTitle = 'View Insight Configuration';
          this.viewPage = true;
          this.insightConfForm.disable();
        }
      });
    }
  }

  onMitreTacticSelect(event) {
    this.mitreTechnique.setValue([]);
    this.insightConfService.getMitreTechniquesByMitreTacticId(event.id)
      .subscribe(mitreTechniques => this.mitreTechniqueList = <any[]>mitreTechniques);
  }

  addInsightConfiguration() {
    this.formSubmitted = true;
    if (this.insightConfForm.invalid) {
      const activeModal = this.ngbModal.open(ConfirmationModalComponent, { size: 'sm' });
      activeModal.componentInstance.message = 'Please Fill the Required Fields';
      activeModal.componentInstance.footer = false;
      activeModal.result.then(() => window.scrollTo(0, 0));

    } else {
    }
  }

  testInsightConfig() {
  }

  previousPage() {
    this.location.back();
  }

  // angular2-multiselect formcontrolName not make as touched itself, so we do manually
  markAsTouched(controlName: string) {
    this.insightConfForm.controls[controlName].markAsTouched();
  }

  // value cancel time, manually clear the values or else it wont get clear
  clearValues(controlName: string) {
    this.insightConfForm.controls[controlName].setValue([]);
    if (controlName === 'mitreTactic') {
      this.insightConfForm.controls['mitreTechnique'].setValue([]);
      this.mitreTechniqueList = [];
    }
    else if (controlName === 'threatCategory') {
      this.insightConfForm.controls['threatSubCategory'].setValue([]);
      this.mitreTechniqueList = [];
    }
  }

}
