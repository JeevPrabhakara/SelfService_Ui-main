import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../user-service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  pageTitle = 'Change Password';
  userId: number;
  userName: string;

  changePasswordForm: FormGroup;

  validationMessages = {
    userPassword: {
      required: 'Password is required',
      passwordShortLength: 'Password must be atleast 8 Characters',
      passwordLongLength: 'Password must not contains more than 20 Characters',
      passwordNotDigit: 'Password Must contain atleast 1 number',
      passwordNotSmallLetter: 'Password Must contain atleast 1 small letter',
      passwordNotCapsLetter: 'Password Must contain atleast 1 capital letter',
      passwordNotSpecialLetter: 'Password Must contain atleast 1 special character $@$!%*?&#^_+.,:;'
    },
    confirmPassword: {
      required: 'Confirm Password is required'
    },
    passwordGroup: {
      passwordMismatch: 'Password and Confirm Password do not Match'
    }
  };

  formErrors = {
    userPassword: '',
    confirmPassword: '',
    passwordGroup: ''
  };

  constructor(private fb: FormBuilder, private activeModal: NgbActiveModal,
    private userService: UserService) { }

  ngOnInit() {
    this.initForm();
  }

  submitForm() {
    this.allFormTouched(this.changePasswordForm);
    this.logValidationErrors();

    if (this.changePasswordForm.valid) {
      const password = this.changePasswordForm.get('passwordGroup').get('userPassword').value;
      this.changePasswordForm.get('password').setValue(password);
      this.userService.changePasswordByAdmin(this.changePasswordForm.value).subscribe(res => {
        this.activeModal.close('Y');
      }, error => {
        this.activeModal.close('N');
      });
    }
  }

  initForm() {
    this.changePasswordForm = this.fb.group({
      userId: [this.userId],
      userName: [this.userName],
      passwordGroup: this.fb.group({
        userPassword: ['', [Validators.required, passwordCustomPattern]],
        confirmPassword: ['', [Validators.required]]
      }, { validator: matchPasswords }),
      password: ['']
    });

    this.changePasswordForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.changePasswordForm);
    });
  }

  cancel() {
    this.userName = '';
    this.activeModal.close('');
  }

  logValidationErrors(group: FormGroup = this.changePasswordForm): void {
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