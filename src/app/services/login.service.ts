import { Injectable } from '@angular/core';
import { RepositoryService } from "../services/repository.service";
import { first } from 'rxjs/operators';
import { User } from '../model/user.model';
import { AuthGuard } from '../auth/auth.guard';
import { BehaviorSubject, Observable } from 'rxjs';
import { TostarService } from './tostar.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private tostar: TostarService,private guard: AuthGuard, private repo: RepositoryService){}

  login = (loginForm: any): Observable<any> => {
    return Observable.create((behaviorSubject: BehaviorSubject<any>) => {
      this.repo.post('company/login', loginForm)
      .pipe(first())
      .subscribe(
        data => {
          const res: any = data;
          localStorage.setItem("jwt", res.data.access_token);
          localStorage.setItem("user", JSON.stringify(res.data));
          localStorage.setItem("userId", JSON.stringify(res.data.company_id));
          this.guard.isUserAuthenticated().next(true);
          this.guard.UserInfo().next(<User>JSON.parse(JSON.stringify(res.data)));
          behaviorSubject.next(res)
        },
        error => {
          this.tostar.custom(error.error.msg)
          behaviorSubject.next(error)
        });
    });
  }
}
