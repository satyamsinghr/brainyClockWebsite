import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isMobile = false;
  screenWidth: number;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
    if (window.innerWidth < 500)
      this.isMobile = true;
    else
      this.isMobile = false;
  }
  supportLanguage = ['en','es'];

  constructor(private translateService: TranslateService) {
    this.getScreenSize();
    this.translateService.addLangs(this.supportLanguage);
    this.translateService.setDefaultLang('en');
  }

  isShow = false;
  ngOnInit(): void {
  }

  Show() {
    this.isShow = true;
  }
  updateValue(val: boolean) {
    this.isShow = val;
  }

}
