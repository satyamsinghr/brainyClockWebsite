import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { LoginService } from 'src/app/services/login.service';
import { RepositoryService } from 'src/app/services/repository.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-resetsuccessfulllogin',
  templateUrl: './resetsuccessfulllogin.component.html',
  styleUrls: ['./resetsuccessfulllogin.component.css']
})
export class ResetsuccessfullloginComponent implements OnInit {

  resetSuccessFullloginForm: FormGroup;
  submitted = false;
  @Output() editedEmitter = new EventEmitter<{}>();
  isShowForgotPassword = false;
  isShowLogin = false;

  constructor(private toastr: ToastrService, private spinner: SpinnerService, private login: LoginService, private guard: AuthGuard, private router: Router, private formBuilder: FormBuilder, private repo: RepositoryService) { }

  ngOnInit(): void {
    this.resetSuccessFullloginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required]]
    });
  }
  get f() { return this.resetSuccessFullloginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.resetSuccessFullloginForm.invalid) {
      return;
    }
    this.spinner.show();
    this.login.login({ email: this.f.email.value, password: this.f.password.value })
      .subscribe(data => {
        this.spinner.hide();
        if (data['success'] != undefined && data['success'] == true) {
          this.router.navigate(['/']);
        }
      });
    error => {
      this.spinner.hide();
    }

  }

  showForgotPassword(val: boolean) {
    this.isShowForgotPassword = val;
  }

  updateValueFromForgotPassword(val: { forgotPassword }) {

    this.isShowForgotPassword = val.forgotPassword;
  }
  showLogin() {
    this.isShowLogin = true;
  }
  updateValueFromLogin(val: { login }) {
    this.isShowLogin = val.login;
  }
}
