import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { RepositoryService } from 'src/app/services/repository.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TostarService } from 'src/app/services/tostar.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  @Input() isShow: boolean;
  isShowRestPasswordLink = false;
  @Output() editedEmitter = new EventEmitter<{}>();
  forgotPasswordForm: FormGroup;
  submitted = false;

  constructor(private tostar: TostarService, private spinner: SpinnerService,
    private guard: AuthGuard, private formBuilder: FormBuilder,
    private repo: RepositoryService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})/)]],
    });
  }
  get f() { return this.forgotPasswordForm.controls; }

  Close() {
    this.isShow = false;
    this.editedEmitter.emit({ forgotPassword: this.isShow, login: true });
  }
  onSubmit() {
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.spinner.show();
    this.repo.post('company/forgot-password', this.forgotPasswordForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.isShowRestPasswordLink = true;
          this.spinner.hide();
          this.tostar.custom(data['msg']);
        },
        error => {
          this.spinner.hide();
          this.tostar.custom(error.error.msg);
        });
  }
  updateValueFromRestPasswordLink(val: { resetPasswordLink, forgotpassword }) {
    this.isShowRestPasswordLink = val.resetPasswordLink;
    this.isShow = val.forgotpassword;
    if (val.forgotpassword != undefined)
      this.editedEmitter.emit({ forgotPassword: this.isShow, login: false });
  }
}
