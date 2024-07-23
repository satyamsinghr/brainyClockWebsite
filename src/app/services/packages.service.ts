import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { PackageType } from '../enum/packagetype.enum';
import { Package } from '../model/package.model';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  packageType = new BehaviorSubject<PackageType | undefined>(undefined);
  isTrial = new BehaviorSubject<boolean | undefined>(undefined);
  public packages: Package[];
  constructor() {
    this.packages = [];
    this.package();
  }

  get(packageType?: PackageType): Package {
    if (packageType != null) {
      return this.packages.find(x => x.type == packageType);
    }
  }
  private package() {
    this.packages.push({ type: PackageType.Monthly, users: 1, employees: 1, location: 1, price: 3 });
    this.packages.push({ type: PackageType.Yearly, users: 1, employees: 1, location: 1, price: 2.5 });
    //this.packages.push({ type: PackageType.Enterprise, users: 2, employees: 20, location: 3, price: 119.99 });
  }
  data:any
  updateEmployee(value: PackageType, noOfEmployees: number) {
    if (value != null) {
    this.data = this.packages.find(x => x.type == value);
      this.data.employees = noOfEmployees;
      return this.packages
    }
  }

  getPackageName(packageType: PackageType) {
    return PackageType[packageType];
  }
  dateOfPurchase() {
    return new Date();
  }
  subscriptionValidTill(packageType?: PackageType) {
    if (packageType == PackageType.Monthly) {
      return new Date(new Date().setMonth(new Date().getMonth() + 1))
    } else {
      return new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    }
  }
  trialTill() {
    return new Date(new Date().setMonth(new Date().getMonth() + 1))
  }
  pacakeFinalPrice(packageType?: PackageType) {
    if (this.isTrial.value)
      return "00.00";
    let price = this.packages.find(x => x.type == packageType)?.price;
    let employees = this.packages.find(x => x.type == packageType)?.employees;
    if (packageType == PackageType.Monthly) {
      return parseFloat((price * employees).toString()).toFixed(2)
    } else {
      return parseFloat((price * 12 * employees).toString()).toFixed(2)
    }
  }
}
