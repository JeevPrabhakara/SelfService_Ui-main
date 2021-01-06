import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../user-service';
import { RoleService } from '../../role/role-service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-user-action',
  templateUrl: './user-action.component.html',
  styleUrls: ['./user-action.component.scss']
})
export class UserActionComponent implements OnInit {

  pageTitle = 'Add User';
  editUser = false;
  viewUser = false;

  userForm: FormGroup;
  submittedButtonDisabled = false;
  existUserNames = [];

  roleList = [];
  roleSetting = {
    text: "Select Roles",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    disabled: false,
    primaryKey: "roleId", // default - id
    labelKey: "roleName",  // default - itemName
  };

  validationMessages = {
    userName: {
      required: 'User Name is required',
      minlength: 'User Name must be greater than 4 characters',
      duplicateUserName: 'User Name already Exist',
      maxlength: 'User Name must not contains more than 15 characters'
    },
    firstName: {
      required: 'First Name is required',
      minlength: 'First Name must be greater than 4 characters',
      maxlength: 'First Name must not contains more than 15 characters'
    },
    lastName: {
      required: 'Last Name is required',
      maxlength: 'Last Name must not contains more than 15 characters'
    },
    email: {
      required: 'Email is required',
      pattern: 'Invalid Email Pattern'
    },
    mobileNumber: {
      required: 'Mobile Number is required',
      pattern: 'Invalid Mobile Number',
      minlength: 'Mobile Number must be atleast 10 numbers',
      maxlength: 'Mobile Number must not contains more than 15 numbers'
    },
    userPassword: {
      required: 'Password is required',
      passwordShortLength: 'Password must be atleast 8 Characters',
      passwordLongLength: 'Password must not contains more than 20 Characters',
      passwordNotDigit: 'Password Must contain atleast 1 number',
      passwordNotSmallLetter: 'Password Must contain atleast 1 small letter',
      passwordNotCapsLetter: 'Password Must contain atleast 1 capital letter',
      passwordNotSpecialLetter: 'Password Must contain atleast 1 special character $@$!%*?&#^_+.,:;',
      maxlength: 'Password must not contains more than 20 characters'
    },
    confirmPassword: {
      required: 'Confirm Password is required',
      maxlength: 'Confirm Password must not contains more than 20 characters'
    },
    passwordGroup: {
      passwordMismatch: 'Password and Confirm Password do not Match'
    },
    userSelectedRoles: {
      required: 'Roles required'
    }
  };

  formErrors = {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    userPassword: '',
    confirmPassword: '',
    passwordGroup: '',
    userSelectedRoles: ''
  };

  constructor(private location: Location, private fb: FormBuilder, private activeRoute: ActivatedRoute,
    public router: Router, private userService: UserService, private roleService: RoleService
    , private _snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.initUserForm();
    const url = this.router.url;

    // not getting all permissions at view time
    if (!url.includes('view')) {
      this.roleService.getAllRoleMasters().subscribe((allRoles: any) => {

        this.roleList = allRoles;
      });
    }

    if (!url.includes('add')) {

      // PasswordGroup disabled on Edit & View Page
      this.userForm.get('passwordGroup').disable({ onlySelf: true });
      this.userForm.updateValueAndValidity();

      this.activeRoute.paramMap.subscribe((params: Params) => {
        const userId = params.get('userId');

        this.userService.getUserByUserId(userId).subscribe((user: any) => {

          this.userForm.setValue({
            userId: user.userId,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobileNumber: user.mobileNumber,
            enabled: user.enabled ? "true" : "false",
            passwordGroup: {
              userPassword: '',
              confirmPassword: ''
            },
            password: '',
            roles: '',
            userSelectedRoles: user.userRoleDTOSet
          });
        });

        if (url.includes('edit')) {
          this.pageTitle = 'Edit User';
          this.editUser = true;
          this.userForm.get('passwordGroup')
        } else {
          this.pageTitle = 'View User';
          this.viewUser = true;
          this.userForm.disable();
          this.roleSetting.disabled = true;
        }
      });
    }

    // preventing duplicate role names -- after set value (for getting roleName)
    if (!url.includes('view')) {
      this.userService.getAllUserNames().subscribe((res: any) => {
        this.existUserNames = res;

        if (!url.includes('add')) {
          const existUserNameIndex = this.existUserNames.indexOf(this.userForm.get('userName').value, 0);
          this.existUserNames.splice(existUserNameIndex, 1);
        }

        this.userForm.get('userName').valueChanges.subscribe(value => {
          this.existUserNames.forEach(existUserName => {
            if (new String(existUserName).toLowerCase() == new String(value).toLowerCase())
              this.userForm.get('userName').setErrors({ duplicateUserName: true });
          });
        });
      });
    }
  }

  submitUser() {
    this.allFormTouched(this.userForm);
    this.logValidationErrors();

    if (this.userForm.invalid)
      return;
    else {
      this.submittedButtonDisabled = true;
      this.userForm.get('password').setValue(this.userForm.get('passwordGroup').get('userPassword').value);
      const userRoles: Array<number[]> = [];
      this.userForm.get('userSelectedRoles').value.forEach(userSelectedRole => {
        userRoles.push(userSelectedRole.roleId);
      });
      this.userForm.get('roles').setValue(userRoles);

      if (!this.editUser) {
        this.userService.createUser(this.userForm.value).subscribe(res => {
          this.previousPage();
        }, error => {
          this.submitError('Saved');
        });
      } else {
        this.userService.updateUser(this.userForm.value).subscribe(res => {
          this.previousPage();
        }, error => {
          this.submitError('Updated');
        });
      }
    }
  }

  submitError(msg: string) {
    this.submittedButtonDisabled = false;
    this._snackBar.open('User Not ' + msg + ' Successfully', null, {
      duration: 4000,
    });
  }

  initUserForm() {
    this.userForm = this.fb.group({
      userId: '',
      userName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      firstName: ['', [Validators.required, Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.pattern('([A-Za-z0-9._%-]{3,})+@([A-Za-z]{2,})+\\.[a-z]{2,3}')]],
      mobileNumber: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(15)]], // (0 | 91)?[6-9][0-9]{9}  , [Validators.required, ]
      enabled: ['false'],
      password: [''],
      passwordGroup: this.fb.group({
        userPassword: ['', [Validators.required, passwordCustomPattern, Validators.maxLength(20)]],
        confirmPassword: ['', [Validators.required, Validators.maxLength(20)]]
      }, { validator: matchPasswords }),
      roles: '',
      userSelectedRoles: ['', [Validators.required]]
    });

    this.userForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.userForm);
    });
  }

  previousPage() {
    this.location.back();
  }

  // manually invoke the error of role select box at 1st time only, if not select anythings
  roleClick() {
    if (!this.userForm.get('userSelectedRoles').touched) {
      setTimeout(() => {
        this.userForm.get('userSelectedRoles').markAsTouched();
        this.logValidationErrors();
      }, 500);
    }
  }

  logValidationErrors(group: FormGroup = this.userForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';

      if (abstractControl && !abstractControl.valid
        && (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          // only add the first error msg, or else it will print entire error object - this.formErrors[key] == ''
          if (errorKey && this.formErrors[key] == '') {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

  allFormTouched(group: FormGroup) {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup)
        this.allFormTouched(abstractControl);
      else
        abstractControl.markAsTouched();
    });
  }

}

function matchPasswords(group: AbstractControl): { [key: string]: any } | null {
  const passwordControl = group.get('userPassword');
  const confirmPasswordControl = group.get('confirmPassword');

  if (passwordControl.value === confirmPasswordControl.value || confirmPasswordControl.pristine)
    return null;
  else
    return { 'passwordMismatch': true };
}

function passwordCustomPattern(group: AbstractControl): { [key: string]: any } | null {

  const passwordValue = group.value;
  if (passwordValue.length > 0) {
    if (passwordValue.length < 8)
      return { 'passwordShortLength': true };
    else if (passwordValue.length > 50)
      return { 'passwordLongLength': true };
    else if (passwordValue.search(/\d/) == -1)
      return { 'passwordNotDigit': true };
    else if (passwordValue.search(/[a-z]/) == -1)
      return { 'passwordNotSmallLetter': true };
    else if (passwordValue.search(/[A-Z]/) == -1)
      return { 'passwordNotCapsLetter': true };
    else if (passwordValue.search(/[\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]/) == -1)
      return { 'passwordNotSpecialLetter': true };
    else
      return null;
  } else
    return null;
}