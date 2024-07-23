import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { PackageService } from 'src/app/services/packages.service';
import { MustMatch } from 'src/app/services/passwordMatchValidator';
import { RepositoryService } from 'src/app/services/repository.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TostarService } from 'src/app/services/tostar.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  submitted = false;
  public showPassword: boolean;
  public showHidePassword: boolean;
  constructor(private tostar: TostarService, public packageService: PackageService, private router: Router, private spinner: SpinnerService, private route: ActivatedRoute,
    private formBuilder: FormBuilder, private repo: RepositoryService) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({

      currentPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    },
      { validator: [MustMatch('newPassword', 'confirmPassword')] });

  }
  get f() { return this.changePasswordForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.spinner.show();
    this.repo.post('company/change-password', this.changePasswordForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.spinner.hide();
          this.tostar.custom(data['msg']);
          if (data['success'] === true)
            this.Reset();
        },
        error => {
          this.spinner.hide();
          this.tostar.custom(error.error.msg);
        });

  }
  Reset() {
    this.submitted = false;
    this.changePasswordForm.reset();
  }
}
