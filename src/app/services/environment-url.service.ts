import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentUrlService  {
  public urlAddress: string = environment.appUrl;
  constructor() { }
}
