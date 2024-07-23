import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentUrlService } from './environment-url.service';
import { AuthGuard } from '../auth/auth.guard';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  constructor(private auth: AuthGuard, private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  public getData = (route: string, id?: number) => {
    if (id) {
      return this.http.get(this.createCompleteRoute(route + '?id=' + id, this.envUrl.urlAddress));
    }
    else {
      return this.http.get(this.createCompleteRoute(route, this.envUrl.urlAddress));
    }
  }

  public getCompanySubscription = (route: string, id?: number) => {
      return this.http.get(this.createCompleteRoute(route + '?id=' + id, this.envUrl.urlAddress));
  }
  public getOrder = (route: string, id?: number) => {
      return this.http.get(this.createCompleteRoute(route + '?id=' + id, this.envUrl.urlAddress));
  }
  
  public post = (route: string, body) => {
    return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), body, this.generateHeaders());
  }
  public file = (route: string, body) => {
    return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), body);
  }
  public update = (route: string, id, body) => {
    return this.http.put(this.createCompleteRoute(route + '?id=' + id, this.envUrl.urlAddress), body, this.generateHeaders());
  }
  public delete = (route: string, id: number) => {
    return this.http.delete(this.createCompleteRoute(route + '?id=' + id, this.envUrl.urlAddress));
  }
  public payment = (route: string,noOfEmployees:any,subscriptionName:any,subscriptionValue:any) => {
    const userId = localStorage.getItem('userId');
    const body = {
      userId: userId,
      subscriptionPlan: subscriptionName,
      isTrial: false,
      isRememberCard: true,
      token: 'tok_visa',
      employees:noOfEmployees,
      amount:subscriptionValue
  };
    return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), body,this.generateHeaders());
  }
  public makePayment = (route: string,subscriptionValue:any,subscriptionName:any,noOfEmployees:any) => {
    const userId = localStorage.getItem('userId');
    const body = {
      company_id:userId,
      amount:subscriptionValue,
      payment_method:"card",
      subscription_plan:subscriptionName,
      employees:noOfEmployees
  };
    return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), body,this.generateHeaders());
  }

  public updatePayment = (route: string,subscriptionValue:any,subscriptionName:any,noOfEmployees:any) => {
    const userId = localStorage.getItem('userId');
    const body = {
      employees:noOfEmployees,
      subscription_plan:subscriptionName,
      amount:subscriptionValue
  };
    return this.http.post(this.createCompleteRoute(route +'/'+ userId, this.envUrl.urlAddress), body,this.generateHeaders());
  }
  public paymentmail = (route: string) => {

    const userId = localStorage.getItem('userId');
    return this.http.post(this.createCompleteRoute(route +'/'+ userId, this.envUrl.urlAddress), null,this.generateHeaders());
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }

  private generateHeaders = () => {
    if (this.auth.isSignedIn()){
      return {
        headers: new HttpHeaders()
          // .set('Content-Type', 'application/json')
          .set('Authorization', 'Bearer ' + localStorage.getItem('jwt'))
      };
    } 
    else{
      return {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
      };
    }
      
  }
}
